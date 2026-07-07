import { AdminGuard } from '@/components/admin-guard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AdminOrders() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="p-2 hover:bg-secondary rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold">Orders Management</h1>
              <p className="text-muted-foreground">View and manage all food orders</p>
            </div>
          </div>

          {/* Orders List */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-secondary border-b border-border font-semibold">
              <div>Customer</div>
              <div>Items</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {/* Sample Order Row */}
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-border items-center hover:bg-secondary/50 transition">
              <div>Amara Okonkwo</div>
              <div className="text-sm text-muted-foreground">Jollof Rice × 2</div>
              <div className="font-semibold">£32.00</div>
              <div>
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-500 text-xs font-medium">
                  Pending
                </span>
              </div>
              <div className="text-sm text-orange-500 hover:underline cursor-pointer">Edit</div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
