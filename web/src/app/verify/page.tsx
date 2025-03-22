"use client"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams()

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Verify Attestation
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        the TEE in your pocket
      </p>
      <div className="max-w-screen p-3">
        <p className="">
          Testament Key:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {searchParams.get('key')}
        </pre>

        <p className="mt-2">
          Attestation:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {searchParams.get('attestation')}
        </pre>

        <p className="mt-2">
          Signature:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {searchParams.get('signature')}
        </pre>

        <p className="mt-2">
          Result:
        </p>
        <pre className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {searchParams.get('result')}
        </pre>
      </div>
      <p className="text-green-600 mb-3">
        Execution result is valid!
      </p>

      <Button>validate onchain</Button>
    </div>
  );
}

