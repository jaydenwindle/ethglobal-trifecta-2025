'use server'

import { verifyAttestation, verifyAssertion } from "appattest-checker-node"
import { parseAttestation, ParsedAttestation } from "appattest-checker-node/dist/attestation"
import { X509Certificate } from '@peculiar/x509';
import { createHash } from "node:crypto"
import { parseAssertion, ParsedAssertion } from "appattest-checker-node/dist/assertion";
import { createWalletClient, Hex, keccak256, sha256, stringToHex, toBytes } from 'viem'

import { createPublicKey } from "node:crypto";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { appAttestCertManagerAbi } from "@/generated";
import asn1 from "asn1.js"

const ECDSASignature = asn1.define('ECDSASignature', function () {
  // @ts-expect-error ignore
  this.seq().obj(
    // @ts-expect-error ignore
    this.key('r').int(),
    // @ts-expect-error ignore
    this.key('s').int()
  );
});

const RPC_URL = "http://127.0.0.1:8545"

const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL)
})


const appattestCertManagerAddress = "0x834Ea01e45F9b5365314358159d92d134d89feEb";

const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')

const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(RPC_URL)
})

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

const ROOT_CA_CERT_HASH = "0xb3554a4b86e13b3b6c08fe3fee3398e5d15886200014bf61ef4da90026955526"

// Function to convert a base64url string to hexadecimal
function base64UrlToHex(base64url: string) {
  // Replace base64url specific characters with base64 equivalents
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' characters if necessary
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('hex');
}

function parseDerSignature(derSignatureHex: string) {
  console.log(derSignatureHex);
  // Convert the hex string to a Buffer
  const derBuffer = Buffer.from(derSignatureHex, 'hex');

  const decoded = ECDSASignature.decode(derBuffer, 'der');

  return {
    r: `0x${decoded.r.toString(16)}`,
    s: `0x${decoded.s.toString(16)}`
  }
}


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
  const rootCertRaw = Buffer.from(rootCert.rawData).toString('hex');
  const rootCertHash = keccak256(`0x${rootCertRaw}`)
  console.log("root cert", rootCertRaw)
  console.log("root cert hash", ROOT_CA_CERT_HASH, keccak256(`0x${rootCertRaw}`));

  const parsedAttestation = await parseAttestation(
    Buffer.from(attestation, "base64"),
  ) as ParsedAttestation
  const intermediateCertRaw = Buffer.from(parsedAttestation.intermediateCert.rawData).toString('hex');
  const intermediateCertHash = keccak256(`0x${intermediateCertRaw}`)
  const leafCertRaw = Buffer.from(parsedAttestation.credCert.rawData).toString('hex');
  const leafCertHash = keccak256(`0x${leafCertRaw}`)

  console.log(parsedAttestation.intermediateCert.rawData)
  console.log("intermediate cert", intermediateCertRaw)
  console.log("intermediate cert hash", keccak256(`0x${intermediateCertRaw}`))
  console.log(parsedAttestation.intermediateCert.rawData)
  console.log("leaf cert", leafCertRaw)
  console.log("leaf cert hash", keccak256(`0x${leafCertRaw}`))

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

  console.log(result, clientDataHash, sha256(stringToHex(result)))

  const parsedAssertion = await parseAssertion(Buffer.from(signature, "base64")) as ParsedAssertion;
  const parsedSignature = parsedAssertion.signature.toString('hex')
  console.log('signature', parsedSignature)

  console.log("message", Buffer.concat([
    parsedAssertion.authData,
    clientDataHash,
  ]).toString('hex'))

  const message = Buffer.concat([
    parsedAssertion.authData,
    clientDataHash,
  ])
  const messageHex = `0x${message.toString('hex')}` as Hex
  // const messageHash = createHash('sha256').update(message).digest().toString('hex')
  const messageHash = sha256(messageHex)

  console.log("message hash",
    messageHash,
    sha256(`0x${message.toString('hex')}`)
  )

  const publicKeyObject = createPublicKey({
    key: attestationResult.publicKeyPem,
  })
  const jwk = publicKeyObject.export({ format: 'jwk' });

  const publicKeyX = jwk.x ? `0x${base64UrlToHex(jwk.x)}` : ""
  const publicKeyY = jwk.y ? `0x${base64UrlToHex(jwk.y)}` : ""
  console.log("public key", publicKeyX, publicKeyY)

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

  const transactions = []

  const intermediateCertPubkey = await publicClient.readContract({
    address: appattestCertManagerAddress,
    abi: appAttestCertManagerAbi,
    functionName: 'certPubKey',
    args: [intermediateCertHash],
  })

  if (intermediateCertPubkey === "0x") {
    const { request } = await publicClient.simulateContract({
      address: appattestCertManagerAddress,
      abi: appAttestCertManagerAbi,
      functionName: 'verifyCert',
      args: [`0x${intermediateCertRaw}`, ROOT_CA_CERT_HASH],
      account,
    })
    const hash = await walletClient.writeContract(request)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    transactions.push(hash)

    console.log('intermediateCert verified', hash, receipt);
  }

  const leafCertPubkey = await publicClient.readContract({
    address: appattestCertManagerAddress,
    abi: appAttestCertManagerAbi,
    functionName: 'certPubKey',
    args: [leafCertHash],
  })

  if (leafCertPubkey === "0x") {
    const { request } = await publicClient.simulateContract({
      address: appattestCertManagerAddress,
      abi: appAttestCertManagerAbi,
      functionName: 'verifyCert',
      args: [`0x${leafCertRaw}`, intermediateCertHash],
      account,
    })
    const hash = await walletClient.writeContract(request)
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    transactions.push(hash)

    console.log('leafCert verified', hash, receipt);
  }

  const parsedDerSignature = parseDerSignature(parsedSignature);
  console.log("parsedSignature", parsedDerSignature)

  const { request } = await publicClient.simulateContract({
    address: appattestCertManagerAddress,
    abi: appAttestCertManagerAbi,
    functionName: 'verifyP256SignedData',
    args: [leafCertHash, messageHash, parsedDerSignature.r, parsedDerSignature.s],
    account,
  })
  const hash = await walletClient.writeContract(request)
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  transactions.push(hash)

  console.log('signature verified', hash, receipt);


  return { attestationValid, signatureValid, rootCertHash, intermediateCert: `0x${intermediateCertRaw}`, intermediateCertHash, leafCert: `0x${leafCertRaw}`, leafCertHash, message: messageHex, messageHash, publicKeyX, publicKeyY, transactions }
}
