import { User } from "lucide-react"

interface AccountHeaderProps {
  name?: string | null
}

export function AccountHeader({ name }: AccountHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          Account
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          My Account
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome back{name ? `, ${name}` : ""}. Manage your orders and bookings.
        </p>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <User className="h-6 w-6" />
      </div>
    </div>
  )
}