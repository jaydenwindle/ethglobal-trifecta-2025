'use server'

import { verifyAttestation, verifyAssertion } from "appattest-checker-node"
import { createHash } from "node:crypto"

export async function validateAttetsationAndSignature(
  { key, attestation, signature, result }: {
    key: string,
    attestation: string,
    signature: string,
    result: string
  }

) {
  console.log(key, attestation)
  const attestationResult = await verifyAttestation(
    {
      appId: '3YM65M954B.com.testament.app',
      developmentEnv: true
    },  // appInfo
    key,
    Buffer.from("hello world", "utf-8"),
    Buffer.from(attestation, "base64"),
  );

  if ('verifyError' in attestationResult) {
    return {
      attestationValid: false,
      signatureValid: false
    }
  }

  const attestationValid = true

  const clientDataHash = createHash('sha256').update(result).digest()

  console.log(result, clientDataHash)

  const assertionResult = await verifyAssertion(
    clientDataHash,
    attestationResult.publicKeyPem,
    '3YM65M954B.com.testament.app',  // appId
    Buffer.from(signature, "base64"),
  );

  console.log(assertionResult)

  if ('verifyError' in assertionResult) {
    return {
      attestationValid,
      signatureValid: false
    }
  }

  const signatureValid = true



  console.log(attestationResult)

  return { attestationValid, signatureValid }
}
