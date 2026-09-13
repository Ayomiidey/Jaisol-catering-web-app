"use client"

import { useQuery } from "@tanstack/react-query"
import type {
  CateringBookingSummary,
} from "@/types/account"

export function useUserBookings(userId?: string) {
  return useQuery<CateringBookingSummary[]>({
    queryKey: ["user-bookings", userId],

    queryFn: async () => {
      const response = await fetch(
        "/api/catering/user"
      )

      if (!response.ok) {
        throw new Error(
          "Failed to fetch bookings"
        )
      }

      return response.json()
    },

    enabled: Boolean(userId),
  })
}