import { Button } from "@/components/ui/button"
import { Check, X } from 'lucide-react';


import { validateAttetsationAndSignature } from "../actions";

export default async function Home({
  searchParams
}) {

  const { key, attestation, signature, result } = await searchParams

  const validationResult = await validateAttetsationAndSignature({ key, attestation, signature, result });

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Verify Attestation
      </h1>
      <div className="max-w-screen p-3">
        <p className="">
          Testament Key:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {key}
        </pre>

        <p className="mt-2">
          Attestation:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {attestation}
        </pre>

        <p className="mt-2">
          Signature:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {signature}
        </pre>

        <p className="mt-2">
          Result:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {result}
        </pre>
      </div>

      {validationResult.attestationValid ? (
        <span className="text-green-600 flex justify-center items-center">
          <Check /> hardware attestation verified
        </span>
      ) : (
        <span className="text-red-600 flex justify-center items-center">
          <X /> invalid hardware attestation
        </span>
      )}

      {validationResult.signatureValid ? (
        <span className="text-green-600 flex justify-center items-center">
          <Check /> signature verified
        </span>
      ) : (
        <span className="text-red-600 flex justify-center items-center">
          <X /> invalid signature
        </span>
      )}

      {validationResult.attestationValid && validationResult.signatureValid && (
        <Button className="mt-4">validate onchain</Button>
      )}

    </div>
  );
}

