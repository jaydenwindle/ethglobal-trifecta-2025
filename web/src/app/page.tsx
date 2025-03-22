import { Button } from "@/components/ui/button"

export default function Home() {
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
      <Button>fibbonaci sequence</Button>
      <Button>latest eth block</Button>
    </div>
  );
}
