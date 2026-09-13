"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  LogOut,
  User,
  ShoppingBag,
  UtensilsCrossed,
  ShieldCheck,
  ArrowRight,
  CalendarDays,
  MapPin,
  Clock3,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

interface Order {
  id: string
  items: string[]
  date: string
  amount: number
  status: string
}

interface Booking {
  id: string
  event: string
  date: string
  location: string
  status: string
  eventTime?: string | null
}

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
    case "confirmed":
    case "completed":
      return "bg-primary/15 text-primary"

    case "making":
    case "processing":
      return "bg-blue-500/10 text-blue-500"

    case "pending":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"

    case "cancelled":
      return "bg-destructive/10 text-destructive"

    default:
      return "bg-secondary text-muted-foreground"
  }
}

export function Account() {
  const { data: session, status } = useSession()

  const userId = (
    session?.user as { id?: string } | undefined
  )?.id

  const { data: ordersData, isLoading: ordersLoading } =
    useQuery<Order[]>({
      queryKey: ["user-orders", userId],

      queryFn: async () => {
        const response = await fetch("/api/orders/user")

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        return response.json()
      },

      enabled: status === "authenticated" && !!userId,
      retry: 2,
    })

  const { data: bookingsData, isLoading: bookingsLoading } =
    useQuery<Booking[]>({
      queryKey: ["user-bookings", userId],

      queryFn: async () => {
        const response = await fetch("/api/catering/user")

        if (!response.ok) {
          return []
        }

        return response.json()
      },

      enabled: status === "authenticated" && !!userId,
    })

  const orders = ordersData ?? []
  const bookings = bookingsData ?? []

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="text-sm text-muted-foreground">
            Loading your account...
          </p>
        </div>
      </div>
    )
  }

  /*
   * NOT AUTHENTICATED
   */
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background px-4 pb-28 pt-10">
        <div className="mx-auto max-w-md">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
              <User className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              My Account
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Sign in to manage your orders, catering bookings,
              and account.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-3">
              <Link href="/sign-in" className="block">
                <Button className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:opacity-90">
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/sign-up" className="block">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-xl"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const firstName =
    session.user.name?.split(" ")[0] || "there"

  const initial =
    session.user.name?.charAt(0).toUpperCase() || "U"

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">

        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">
            MY ACCOUNT
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
            Welcome back, {firstName}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your orders and catering bookings.
          </p>
        </div>

        {/* Profile */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="h-2 bg-primary" />

          <div className="flex items-center gap-4 p-5 md:p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
              {initial}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">
                {session.user.name || "User"}
              </h2>

              <p className="truncate text-sm text-muted-foreground">
                {session.user.email}
              </p>

              <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                Customer
              </span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>

            <p className="text-2xl font-bold">
              {orders.length}
            </p>

            <p className="text-sm text-muted-foreground">
              Total Orders
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
            </div>

            <p className="text-2xl font-bold">
              {bookings.length}
            </p>

            <p className="text-sm text-muted-foreground">
              Catering Bookings
            </p>
          </div>
        </div>

        {/* Orders */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Food Orders
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Recent Orders
              </h2>
            </div>
          </div>

          {ordersLoading ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />

              <p className="text-sm text-muted-foreground">
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

              <p className="font-medium">
                No orders yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Ready for something delicious?
              </p>

              <Link href="/explore" className="mt-5 inline-block">
                <Button className="rounded-xl bg-primary text-primary-foreground hover:opacity-90">
                  Explore Menu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50 md:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 font-semibold">
                        {Array.isArray(order.items)
                          ? order.items.join(" + ")
                          : order.items}
                      </h3>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {order.date}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-border pt-3">
                    <p className="text-lg font-bold text-primary">
                      £{order.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Catering */}
        <section className="mb-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Events
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Catering Bookings
            </h2>
          </div>

          {bookingsLoading ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />

              <p className="text-sm text-muted-foreground">
                Loading bookings...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <UtensilsCrossed className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

              <p className="font-medium">
                No catering bookings yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Planning an event? Let Jaisol handle the food.
              </p>

              <Link href="/book" className="mt-5 inline-block">
                <Button className="rounded-xl bg-primary text-primary-foreground hover:opacity-90">
                  Book Catering
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50 md:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">
                        {booking.event}
                      </h3>

                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {booking.date}
                        </div>

                        {booking.eventTime && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock3 className="h-3.5 w-3.5" />
                            {booking.eventTime}
                          </div>
                        )}

                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>{booking.location}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Admin */}
        {(
          session.user as {
            isAdmin?: boolean
          }
        ).isAdmin && (
          <section className="mb-8">
            <Link href="/admin" className="block">
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 transition hover:bg-primary/15 md:p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
                    <ShieldCheck className="h-5 w-5 text-primary-foreground" />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">
                      Admin Dashboard
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Manage orders, bookings and menu
                    </p>
                  </div>

                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Quick Actions */}
        <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-semibold">
            Quick Actions
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/explore">
              <Button className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:opacity-90">
                Order Food
              </Button>
            </Link>

            <Link href="/book">
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl"
              >
                Book Catering
              </Button>
            </Link>
          </div>
        </section>

        {/* Sign out */}
        <button
          type="button"
          onClick={() =>
            signOut({
              redirect: true,
              redirectTo: "/",
            })
          }
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 font-medium text-destructive transition hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}