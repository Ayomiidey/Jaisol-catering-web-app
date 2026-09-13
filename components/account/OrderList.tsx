import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { Order } from "@/types/account"
import { OrderCard } from "./OrderCard"
import { EmptyState } from "./EmptyState"

interface OrderListProps {
  orders: Order[]
  isLoading: boolean
}

export function OrderList({
  orders,
  isLoading,
}: OrderListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-5 w-5" />}
        title="No orders yet"
        description="Your food orders will appear here once you place your first order."
        action={
          <Link
            href="/menu"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse Menu
          </Link>
        }
      />
    )
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
        />
      ))}
    </div>
  )
}