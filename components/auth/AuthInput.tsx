import { ReactNode } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ReactNode
}

export function AuthInput({
  label,
  icon,
  id,
  ...props
}: AuthInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
      </Label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}

        <Input
          id={id}
          className={icon ? "pl-10" : undefined}
          {...props}
        />
      </div>
    </div>
  )
}