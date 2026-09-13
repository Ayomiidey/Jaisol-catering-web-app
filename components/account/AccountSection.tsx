import { ReactNode } from "react"

interface AccountSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function AccountSection({
  title,
  description,
  children,
}: AccountSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  )
}