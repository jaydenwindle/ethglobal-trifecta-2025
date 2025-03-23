import { Button } from "@/components/ui/button"
import { Check, X } from 'lucide-react';


import { validateAttetsationAndSignature } from "../actions";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function Home({
  searchParams
}: { searchParams: Promise<SearchParams> }) {

  const { key, attestation, signature, result } = await searchParams

  const validationResult = await validateAttetsationAndSignature({ key: key as string, attestation: attestation as string, signature: signature as string, result: result as string });

  console.log(validationResult)

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Verify Attestation
      </h1>
      <div className="max-w-screen p-3">
        <p className="font-bold">
          Testament Key:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {key}
        </pre>

        <p className="font-bold mt-2">
          Attestation:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {attestation}
        </pre>

        <p className="font-bold mt-2">
          Signature:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {signature}
        </pre>

        <p className="font-bold mt-2">
          Result:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {result}
        </pre>
      </div>

      {validationResult.attestationValid ? (
        <span className="text-green-600 flex justify-center items-center">
          <Check /> hardware attestation validated offchain
        </span>
      ) : (
        <span className="text-red-600 flex justify-center items-center">
          <X /> invalid hardware attestation
        </span>
      )}

      {validationResult.signatureValid ? (
        <span className="text-green-600 flex justify-center items-center">
          <Check /> signature validated offchain
        </span>
      ) : (
        <span className="text-red-600 flex justify-center items-center">
          <X /> invalid signature
        </span>
      )}

      {validationResult.transactions != undefined && validationResult.transactions.length > 0 && (
        <>
          <span className="text-green-600 flex justify-center items-center">
            <Check /> verified onchain
          </span>
          {validationResult.transactions.map((txHash, index) => (
            <>
              <p className="font-bold">
                Transaction {index + 1}:
              </p>
              <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-3">
                {txHash}
              </pre>
            </>
          ))}
        </>
      )}

    </div>
  );
}

