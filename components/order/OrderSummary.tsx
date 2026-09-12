interface OrderSummaryProps {
  itemCount: number
  subtotal: number
  deliveryFee: number
}

export function OrderSummary({
  itemCount,
  subtotal,
  deliveryFee,
}: OrderSummaryProps) {
  const total = subtotal + deliveryFee

  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Items ({itemCount})
          </span>

          <span>
            £{Number(subtotal).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Delivery
          </span>

          <span>
            £{Number(deliveryFee).toFixed(2)}
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">
              Total
            </span>

            <span className="text-xl font-bold text-primary">
              £{Number(total).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}