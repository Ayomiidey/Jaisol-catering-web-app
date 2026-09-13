"use client"

import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { useState } from "react"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { AdminGuard } from "@/components/admin-guard"
import {
  BookingFilters,
  BookingList,
} from "@/components/admin/bookings"

import {
  AdminBooking,
  BookingStatus,
} from "@/types/catering"

function BookingsContent() {
  const queryClient = useQueryClient()

  const [statusFilter, setStatusFilter] =
    useState<BookingStatus | "">("")

  const [expandedId, setExpandedId] =
    useState<string | null>(null)

  const bookingsQuery = useQuery<AdminBooking[]>({
    queryKey: ["admin-bookings", statusFilter],

    queryFn: async () => {
      const url = statusFilter
        ? `/api/admin/bookings?status=${statusFilter}`
        : "/api/admin/bookings"

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }

      return response.json()
    },
  })

  const updateBooking = useMutation({
    mutationFn: async ({
      id,
      status,
      estimatedCost,
    }: {
      id: string
      status?: BookingStatus
      estimatedCost?: number
    }) => {
      const response = await fetch(
        `/api/admin/bookings/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            estimatedCost,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update booking")
      }

      return response.json()
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-bookings"],
      })
    },
  })

  function handleStatusChange(
    id: string,
    status: BookingStatus
  ) {
    updateBooking.mutate({
      id,
      status,
    })
  }

  function handleCostChange(
    id: string,
    cost: number
  ) {
    updateBooking.mutate({
      id,
      estimatedCost: cost,
    })
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6 text-foreground md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-lg p-2 transition hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <h1 className="text-2xl font-bold md:text-4xl">
                Catering Bookings
              </h1>

              <p className="text-sm text-muted-foreground">
                Manage event catering requests
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => bookingsQuery.refetch()}
            disabled={bookingsQuery.isFetching}
            className="rounded-lg p-2 transition hover:bg-secondary disabled:opacity-50"
          >
            <RefreshCw
              className={`h-5 w-5 ${
                bookingsQuery.isFetching
                  ? "animate-spin"
                  : ""
              }`}
            />
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <BookingFilters
            value={statusFilter}
            onChange={(status) => {
              setStatusFilter(status)
              setExpandedId(null)
            }}
          />
        </div>

        {/* Loading */}
        {bookingsQuery.isLoading && (
          <div className="flex justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {/* Error */}
        {bookingsQuery.isError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="font-medium">
              Failed to load bookings
            </p>

            <button
              type="button"
              onClick={() => bookingsQuery.refetch()}
              className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Try again
            </button>
          </div>
        )}

        {/* List */}
        {!bookingsQuery.isLoading &&
          !bookingsQuery.isError && (
            <BookingList
              bookings={bookingsQuery.data ?? []}
              expandedId={expandedId}
              onToggle={(id) =>
                setExpandedId(
                  expandedId === id ? null : id
                )
              }
              onUpdateStatus={handleStatusChange}
              onUpdateCost={handleCostChange}
              isUpdating={updateBooking.isPending}
            />
          )}
      </div>
    </div>
  )
}

export default function AdminBookings() {
  return (
    <AdminGuard>
      <BookingsContent />
    </AdminGuard>
  )
}