"use client"

import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  AuthBrand,
  AuthError,
  AuthFooter,
  AuthInput,
} from "@/components/auth"

export function SignUpForm() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      )
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data?.error ||
            "Unable to create your account."
        )
        return
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(
          "Account created, but automatic sign-in failed. Please sign in manually."
        )
        return
      }

      router.replace("/")
      router.refresh()
    } catch {
      setError(
        "Something went wrong. Please try again."
      )
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
          Create your account
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Join Jaisol Catering and manage your orders and bookings.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <AuthInput
          id="name"
          label="Full Name"
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
          icon={<User className="h-4 w-4" />}
        />

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
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
          icon={<Lock className="h-4 w-4" />}
        />

        <AuthInput
          id="confirm-password"
          label="Confirm Password"
          type="password"
          placeholder="Enter your password again"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
          autoComplete="new-password"
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

          {isLoading
            ? "Creating account..."
            : "Create Account"}
        </Button>
      </form>

      <div className="mt-6">
        <AuthFooter mode="sign-up" />
      </div>
    </>
  )
}