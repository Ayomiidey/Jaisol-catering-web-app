"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  Loader2,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  AccountHeader,
  AccountProfile,
  AccountStats,
  AccountSection,
  OrderList,
  BookingList,
  AccountQuickActions,
} from "@/components/account"

import { AdminDashboardCard } from "@/components/admin"
import { SignOutButton } from "@/components/auth"

import { useUserOrders } from "@/hooks/useUserOrders"
import { useUserBookings } from "@/hooks/useUserBookings"

export default function AccountPage() {
  const {
    data: session,
    status,
  } = useSession()

  const userId = session?.user?.id

  const {
    data: orders = [],
    isLoading: ordersLoading,
  } = useUserOrders(userId)

  const {
    data: bookings = [],
    isLoading: bookingsLoading,
  } = useUserBookings(userId)

  if (status === "loading") {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    )
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <User className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Sign in to your account
          </h1>

          <p className="mt-2 text-muted-foreground">
            Sign in to view your orders and catering bookings.
          </p>

          <div className="mt-6 grid gap-3">
            <Link
              href="/sign-in"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center justify-center rounded-md border bg-background px-4 font-medium transition-colors hover:bg-muted"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const isAdmin = session.user.role === "admin"

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-10">

          <AccountHeader
            name={session.user.name}
          />

          <AccountProfile
            name={session.user.name}
            email={session.user.email}
          />

          <AccountStats
            orderCount={orders.length}
            bookingCount={bookings.length}
          />

          <AccountSection
            title="Recent Orders"
            description="Your recent food orders."
          >
            <OrderList
              orders={orders}
              isLoading={ordersLoading}
            />
          </AccountSection>

          <AccountSection
            title="Upcoming Catering"
            description="Your catering bookings and event details."
          >
            <BookingList
              bookings={bookings}
              isLoading={bookingsLoading}
            />
          </AccountSection>

          {isAdmin && <AdminDashboardCard />}

          <AccountSection
            title="Quick Actions"
            description="What would you like to do?"
          >
            <AccountQuickActions />
          </AccountSection>

          <div className="flex justify-center border-t pt-8">
            <SignOutButton />
          </div>

        </div>
      </div>
    </main>
  )
}