import { ShoppingBag } from "lucide-react"
import { Order } from "@/types/account"

interface OrderCardProps {
  order: Order
}

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
    case "confirmed":
      return "bg-primary/15 text-primary"

    case "making":
    case "processing":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"

    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"

    case "cancelled":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"

    default:
      return "bg-muted text-muted-foreground"
  }
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold">
              Order #{order.id.slice(-8)}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {order.items.length} item
          {order.items.length !== 1 ? "s" : ""}
        </p>

        <p className="font-bold">
          £{order.amount.toFixed(2)}
        </p>
      </div>
    </div>
  )
}