import { useEffect, useCallback, useState, useDebugValue } from "react"

import { generateHardwareKey, getAttestation, generateHardwareSignatureWithAssertion, IntegrityError } from '@pagopa/io-react-native-integrity';
import { useAsyncStorage, } from '@react-native-async-storage/async-storage';

export function useHardwareKey() {
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

  const sign = useCallback(async (data?: string) => {
    if (!key || !data) return null

    try {
      const signature = await generateHardwareSignatureWithAssertion(
        data,
        key
      );

      return signature
    } catch (e) {
      const error = e as IntegrityError;
      console.log(JSON.stringify(error));
    }

  }, [key])

  return {
    loading,
    key,
    attestation,
    generateKey,
    sign
  }
}
