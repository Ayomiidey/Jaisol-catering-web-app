"use client"

import { useQuery } from "@tanstack/react-query"
import type { Order } from "@/types/account"

export function useUserOrders(userId?: string) {
  return useQuery<Order[]>({
    queryKey: ["user-orders", userId],

    queryFn: async () => {
      const response = await fetch(
        "/api/orders/user"
      )

      if (!response.ok) {
        throw new Error(
          "Failed to fetch orders"
        )
      }

      return response.json()
    },

    enabled: Boolean(userId),
    retry: 2,
  })
}