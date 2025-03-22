import React, { useEffect } from "react"
import { StatusBar } from 'expo-status-bar';
import { FileKey, BadgeCheck, Copy } from '@tamagui/lucide-icons'
import { createTamagui, TamaguiProvider, View, Text, Button, H3, YStack, TextArea, Label, XStack, Spinner } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { useCallback, useState } from 'react';
import { generateHardwareKey, getAttestation, IntegrityError } from '@pagopa/io-react-native-integrity';
import * as Clipboard from 'expo-clipboard';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

const config = createTamagui(defaultConfig)

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [key, setKey] = useState<string>();
  const [attestation, setAttestation] = useState<string>();
  const { setItem, getItem } = useAsyncStorage("testament-key")

  useEffect(() => {
    async function getKey() {
      const keyData = await getItem()

      if (keyData) {
        const { key, attestation } = JSON.parse(keyData)
        setKey(key)
        setAttestation(attestation)
      }

      setLoading(false)
    }

    getKey()
  }, [])

  const generateKey = useCallback(async () => {
    setLoading(true);
    try {
      const key = await generateHardwareKey();
      console.log(key);

      const attestation = await getAttestation("hello world", key);
      console.log(attestation);

      setKey(key);
      setAttestation(attestation);

      await setItem(JSON.stringify({ key, attestation }))
    } catch (e) {
      console.error(e)
      const error = e as IntegrityError;
      console.log(JSON.stringify(error));
    }

    setLoading(false)
  }, [])

  return (
    <TamaguiProvider config={config}>
      <YStack flex={1} alignItems='center' justifyContent='center' gap="$3" paddingHorizontal="$3">
        <StatusBar style="auto" />
        <H3 fontWeight="600">TESTAMENT</H3>
        <Text>The TEE that lives in your pocket</Text>
        {key && (
          <YStack gap="$3" marginTop="$6">
            <Text fontWeight="600">Testament Key:</Text>
            <Text numberOfLines={1}>{key}</Text>
            <Button icon={Copy} fontWeight="600" onPress={() => Clipboard.setStringAsync(key)}>Copy</Button>
          </YStack>
        )}
        {attestation && (
          <YStack gap="$3" marginTop="$3">
            <Text fontWeight="600">Key Attestation:</Text>
            <Text numberOfLines={1}>{attestation}</Text>
            <Button icon={Copy} fontWeight="600" onPress={() => Clipboard.setStringAsync(attestation)}>Copy</Button>
          </YStack>
        )}
        {key && attestation && (
          <XStack alignItems="center" marginTop="$6" backgroundColor="$green3" paddingHorizontal="$4" paddingVertical="$3" borderRadius="$10">
            <BadgeCheck marginRight="$2" color={"green"} />
            <Text color={"green"}>Ready to attest</Text>
          </XStack>
        )}
        {!loading && !key && !attestation && (
          <Button icon={FileKey} onPress={generateKey}>
            Generate Testament Key
          </Button>
        )}
        {loading && (
          <Spinner />
        )}
      </YStack>
    </TamaguiProvider>
  );
}
