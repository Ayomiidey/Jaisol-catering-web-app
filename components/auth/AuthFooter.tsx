import Link from "next/link"

interface AuthFooterProps {
  mode: "sign-in" | "sign-up"
}

export function AuthFooter({ mode }: AuthFooterProps) {
  if (mode === "sign-in") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    )
  }

  return (
    <p className="text-center text-sm text-muted-foreground">
      Already have an account?{" "}
      <Link
        href="/sign-in"
        className="font-semibold text-primary hover:underline"
      >
        Sign in
      </Link>
    </p>
  )
}