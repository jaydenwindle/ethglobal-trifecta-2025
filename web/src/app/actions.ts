'use server'

import { verifyAttestation, verifyAssertion } from "appattest-checker-node"
import { parseAttestation, ParsedAttestation } from "appattest-checker-node/dist/attestation"
import { X509Certificate } from '@peculiar/x509';
import { createHash } from "node:crypto"
import { parseAssertion, ParsedAssertion } from "appattest-checker-node/dist/assertion";

const DEFAULT_APPATTEST_ROOT_CERT_PEM = `
-----BEGIN CERTIFICATE-----
MIICITCCAaegAwIBAgIQC/O+DvHN0uD7jG5yH2IXmDAKBggqhkjOPQQDAzBSMSYw
JAYDVQQDDB1BcHBsZSBBcHAgQXR0ZXN0YXRpb24gUm9vdCBDQTETMBEGA1UECgwK
QXBwbGUgSW5jLjETMBEGA1UECAwKQ2FsaWZvcm5pYTAeFw0yMDAzMTgxODMyNTNa
Fw00NTAzMTUwMDAwMDBaMFIxJjAkBgNVBAMMHUFwcGxlIEFwcCBBdHRlc3RhdGlv
biBSb290IENBMRMwEQYDVQQKDApBcHBsZSBJbmMuMRMwEQYDVQQIDApDYWxpZm9y
bmlhMHYwEAYHKoZIzj0CAQYFK4EEACIDYgAERTHhmLW07ATaFQIEVwTtT4dyctdh
NbJhFs/Ii2FdCgAHGbpphY3+d8qjuDngIN3WVhQUBHAoMeQ/cLiP1sOUtgjqK9au
Yen1mMEvRq9Sk3Jm5X8U62H+xTD3FE9TgS41o0IwQDAPBgNVHRMBAf8EBTADAQH/
MB0GA1UdDgQWBBSskRBTM72+aEH/pwyp5frq5eWKoTAOBgNVHQ8BAf8EBAMCAQYw
CgYIKoZIzj0EAwMDaAAwZQIwQgFGnByvsiVbpTKwSga0kP0e8EeDS4+sQmTvb7vn
53O5+FRXgeLhpJ06ysC5PrOyAjEAp5U4xDgEgllF7En3VcE3iexZZtKeYnpqtijV
oyFraWVIyd/dganmrduC1bmTBGwD
-----END CERTIFICATE-----
`;

export async function validateAttetsationAndSignature(
  { key, attestation, signature, result }: {
    key: string,
    attestation: string,
    signature: string,
    result: string
  }

) {
  console.log(key, attestation)
  const rootCert = new X509Certificate(DEFAULT_APPATTEST_ROOT_CERT_PEM)
  console.log("root cert", Buffer.from(rootCert.rawData).toString('hex'))
  const parsedAttestation = await parseAttestation(
    Buffer.from(attestation, "base64"),
  ) as ParsedAttestation

  console.log(parsedAttestation.intermediateCert.rawData)
  console.log("intermediate cert", Buffer.from(parsedAttestation.intermediateCert.rawData).toString('hex'))
  console.log(parsedAttestation.intermediateCert.rawData)
  console.log("leaf cert", Buffer.from(parsedAttestation.credCert.rawData).toString('hex'))

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

  console.log(attestationResult.publicKeyPem);

  const clientDataHash = createHash('sha256').update(result).digest()

  console.log(result, clientDataHash)

  const parsedAssertion = await parseAssertion(Buffer.from(signature, "base64")) as ParsedAssertion;
  console.log('signature', parsedAssertion.signature.toString('hex'))

  console.log("message", Buffer.concat([
    parsedAssertion.authData,
    clientDataHash,
  ]).toString('hex'))

  console.log("message hash",
    createHash('sha256').update(Buffer.concat([
      parsedAssertion.authData,
      clientDataHash,
    ])).digest().toString('hex'))

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
