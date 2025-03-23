import React, { useEffect, useRef, useCallback, useState } from "react"
import { FileKey, BadgeCheck, Copy } from '@tamagui/lucide-icons'
import { createTamagui, TamaguiProvider, View, Text, Button, H3, YStack, TextArea, Label, XStack, Spinner } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { StyleSheet } from "react-native";
import { generateHardwareKey, getAttestation, IntegrityError } from '@pagopa/io-react-native-integrity';
import * as Clipboard from 'expo-clipboard';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
const config = createTamagui(defaultConfig)

import { useHardwareKey } from "../hooks/useHardwareKey";

export default function App() {
  const { loading, key, attestation, generateKey } = useHardwareKey()

  return (
    <TamaguiProvider config={config}>
      <YStack flex={1} alignItems='center' justifyContent='center' gap="$3" paddingHorizontal="$3">
        <H3 fontWeight="600">TESTAMENT</H3>
        <Text>The TEE that lives in your pocket</Text>
        <YStack gap="$3" marginTop="$6">

          {key && (
            <>
              <Text fontWeight="600">Testament Key:</Text>
              <Text numberOfLines={1}>{key}</Text>
              <Button icon={Copy} fontWeight="600" onPress={() => Clipboard.setStringAsync(key)}>Copy</Button>
            </>
          )}
          {attestation && (
            <>
              <Text fontWeight="600">Key Attestation:</Text>
              <Text numberOfLines={1}>{attestation}</Text>
              <Button icon={Copy} fontWeight="600" onPress={() => Clipboard.setStringAsync(attestation)}>Copy</Button>
            </>
          )}
        </YStack>
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
    </TamaguiProvider >
  );
}
