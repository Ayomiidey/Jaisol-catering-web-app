import Link from "next/link"
import Image from "next/image"

export function AuthBrand() {
  return (
    <div className="flex justify-center">
      <Link
        href="/"
        className="inline-flex items-center gap-3"
      >
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
          <Image
            src="/logo.png"
            alt="Jaisol Catering"
            width={48}
            height={48}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="text-left">
          <p className="font-bold leading-none">
            Jaisol
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Catering
          </p>
        </div>
      </Link>
    </div>
  )
}