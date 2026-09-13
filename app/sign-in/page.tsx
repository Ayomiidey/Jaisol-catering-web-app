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
  UtensilsCrossed,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      const requestedCallback =
        new URLSearchParams(window.location.search).get(
          "callbackUrl"
        )

      const callbackUrl =
        requestedCallback?.startsWith("/") &&
        !requestedCallback.startsWith("//")
          ? requestedCallback
          : "/"

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError("Invalid email or password.")
        return
      }

      router.replace(callbackUrl)
      router.refresh()
    } catch (error) {
      console.error(error)
      setError("Something went wrong. Please try again.")
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
            {/* Brand strip */}
            <div className="h-2 bg-primary" />

            <div className="p-6 sm:p-8">

              {/* Brand */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                  <UtensilsCrossed className="h-7 w-7 text-primary" />
                </div>

                <p className="text-sm font-bold tracking-[0.25em] text-primary">
                  JAISOL
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight">
                  Welcome back
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in to manage your orders and bookings.
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
                onSubmit={handleSignIn}
                className="space-y-5"
              >
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

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password
                  </Label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      required
                      disabled={loading}
                      className="h-12 rounded-xl pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:opacity-90"
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign up */}
              <div className="mt-7 text-center text-sm">
                <span className="text-muted-foreground">
                  Don't have an account?{" "}
                </span>

                <Link
                  href="/sign-up"
                  className="font-semibold text-primary hover:underline"
                >
                  Create one
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