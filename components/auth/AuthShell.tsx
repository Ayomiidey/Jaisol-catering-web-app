import { ReactNode } from "react"

interface AuthShellProps {
  children: ReactNode
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border bg-card shadow-xl">
          <div className="h-2 bg-primary" />

          <div className="p-6 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}