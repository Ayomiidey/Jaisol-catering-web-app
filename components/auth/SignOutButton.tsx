"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import {
  Loader2,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      await signOut({
        callbackUrl: "/",
      })
    } catch {
      setIsSigningOut(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="w-full rounded-xl sm:w-auto"
    >
      {isSigningOut ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}

      {isSigningOut
        ? "Signing out..."
        : "Sign Out"}
    </Button>
  )
}