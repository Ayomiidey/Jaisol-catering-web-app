"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Loader2,
  Lock,
  Mail,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  AuthBrand,
  AuthError,
  AuthFooter,
  AuthInput,
} from "@/components/auth"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setIsLoading(true)

    try {
      const callbackUrl =
        searchParams.get("callbackUrl") || "/"

      const safeCallbackUrl =
        callbackUrl.startsWith("/") &&
        !callbackUrl.startsWith("//")
          ? callbackUrl
          : "/"

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: safeCallbackUrl,
      })

      if (!result || result.error) {
        setError("Invalid email or password.")
        return
      }

      router.replace(safeCallbackUrl)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <AuthBrand />

      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to continue to your Jaisol account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <AuthInput
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          icon={<Mail className="h-4 w-4" />}
        />

        <AuthInput
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          icon={<Lock className="h-4 w-4" />}
        />

        <AuthError message={error} />

        <Button
          type="submit"
          className="h-11 w-full"
          disabled={isLoading}
        >
          {isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6">
        <AuthFooter mode="sign-in" />
      </div>
    </>
  )
}