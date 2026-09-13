"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Mail,
  UserRound,
  UtensilsCrossed,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      )
      return
    }

    setLoading(true)

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
          data.message ||
            data.error ||
            "Unable to create account."
        )

        return
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        router.push("/sign-in")
        return
      }

      router.replace("/")
      router.refresh()
    } catch (error) {
      console.error(error)

      setError(
        "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Back */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jaisol
          </Link>

          {/* Card */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            <div className="h-2 bg-primary" />

            <div className="p-6 sm:p-8">

              {/* Heading */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                  <UtensilsCrossed className="h-7 w-7 text-primary" />
                </div>

                <p className="text-sm font-bold tracking-[0.25em] text-primary">
                  JAISOL
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight">
                  Create your account
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  Join Jaisol and make ordering easier.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSignUp}
                className="space-y-5"
              >
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full name
                  </Label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      required
                      disabled={loading}
                      className="h-12 rounded-xl pl-10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email address
                  </Label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      required
                      disabled={loading}
                      className="h-12 rounded-xl pl-10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password
                  </Label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      required
                      disabled={loading}
                      minLength={8}
                      className="h-12 rounded-xl pl-10"
                    />
                  </div>
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm password
                  </Label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Enter your password again"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      required
                      disabled={loading}
                      minLength={8}
                      className="h-12 rounded-xl pl-10"
                    />
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:opacity-90"
                >
                  {loading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign in */}
              <div className="mt-7 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>

                <Link
                  href="/sign-in"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Authentic West African catering
          </p>
        </div>
      </div>
    </main>
  )
}