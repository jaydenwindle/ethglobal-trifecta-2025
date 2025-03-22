"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("")
  useEffect(() => {
    setUrl(window.location.href)
  }, [])
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        TESTAMENT
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        the TEE in your pocket
      </p>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        demos:
      </p>
      <Button asChild>
        <a href={`testament://attest?program=fibbonaci&input=20&callbackUrl=${url + "verify"}`}>fibbonaci sequence</a>
      </Button>
      <Button asChild>
        <a href={`testament://attest?program=eth-get-block&input=latest&callbackUrl=${url + "verify"}`}>latest eth block</a>
      </Button>
    </div >
  );
}
