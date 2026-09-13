import { Mail, User } from "lucide-react"

interface AccountProfileProps {
  name?: string | null
  email?: string | null
}

export function AccountProfile({
  name,
  email,
}: AccountProfileProps) {
  const displayName = name || "Jaisol Customer"

  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
      <div className="h-2 bg-primary" />

      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {initial}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-semibold">{displayName}</span>
          </div>

          {email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}