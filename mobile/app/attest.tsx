import { createTamagui, TamaguiProvider, View, Text, Button, H3, YStack, TextArea, Label, XStack, Spinner } from 'tamagui'
import { useLocalSearchParams, useGlobalSearchParams, Link, Redirect, useRouter } from 'expo-router';
import { FileSignature } from "@tamagui/lucide-icons"
import * as Linking from 'expo-linking';
import { start, StartParams } from 'react-native-helios';
import { ethers } from 'ethers';
import { getHeliosProvider, fallbackCheckpoint, Network } from 'react-native-helios';

import { createPublicClient, GetBlockParameters, http } from 'viem'
import { mainnet } from 'viem/chains'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})


import { useHardwareKey } from "../hooks/useHardwareKey";

const programs = {
  'fibbonaci': async (input: string) => {
    const n = parseInt(input, 10);
    if (isNaN(n) || n < 0) return "Invalid input";

    if (n === 0) return "0";
    if (n === 1) return "1";

    let a = 0n;
    let b = 1n;
    let temp;

    for (let i = 2; i <= n; i++) {
      temp = a + b;
      a = b;
      b = temp;
    }

    return b.toString();
  },
  'eth-get-block': async (input: string) => {
    const block = await publicClient.getBlock(input as GetBlockParameters)
    return block.hash
  }
}

export default function Attest() {
  const { loading, key, attestation, sign } = useHardwareKey()

  const router = useRouter()

  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  const url = Linking.useLinkingURL();

  if (!url) return <Redirect href="/" />

  const { queryParams } = Linking.parse(url)

  console.log("Local:", local.user, "Global:", glob.user, url);
  return (
    <YStack flex={1} alignItems='center' justifyContent='center' gap="$3" paddingHorizontal="$3">
      <H3 fontWeight="600">Attestation Request</H3>

      <YStack gap="$3" marginTop="$6" paddingHorizontal="$3" width="100%">
        <Text fontWeight="600">Program:</Text>
        <Text numberOfLines={1}>{queryParams?.program}</Text>
      </YStack>

      <YStack gap="$3" marginTop="$3" paddingHorizontal="$3" width="100%">
        <Text fontWeight="600">Input:</Text>
        <Text numberOfLines={1}>{queryParams?.input}</Text>
      </YStack>

      <YStack gap="$3" marginTop="$3" paddingHorizontal="$3" width="100%">
        <Text fontWeight="600">Callback URL:</Text>
        <Text numberOfLines={1}>{queryParams?.callbackUrl}</Text>
      </YStack>

      {loading && (
        <Spinner />
      )}

      {!loading && (
        <Button icon={FileSignature} fontWeight="500" marginTop="$6" onPress={async () => {
          console.log(queryParams)
          if (!queryParams?.callbackUrl || !queryParams.program || !queryParams.input) return;

          const program = programs[queryParams.program as keyof typeof programs]
          console.log("here", program)
          const data = await program(queryParams.input as string)
          console.log("data", data)
          const signature = await sign(data);

          if (!key || !attestation || !signature) return;

          console.log(signature)
          if (!queryParams?.callbackUrl || !key || !attestation || !signature) return;

          const callbackUrl = new URL(queryParams.callbackUrl as string)

          callbackUrl.searchParams.set("key", key)
          callbackUrl.searchParams.set("attestation", attestation)
          callbackUrl.searchParams.set("signature", signature)
          callbackUrl.searchParams.set("result", data)

          if (queryParams?.callbackUrl) {
            Linking.openURL(callbackUrl.toString())
          }

          setTimeout(router.dismiss, 250)
        }}>Execute & Sign</Button>
      )
      }


    </YStack >
  )
}
