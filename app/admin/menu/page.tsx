import { AdminGuard } from '@/components/admin-guard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'

export default function AdminMenu() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-secondary rounded-lg transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold">Menu Management</h1>
                <p className="text-muted-foreground">Create and edit menu items</p>
              </div>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>

          {/* Menu Items List */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 bg-secondary border-b border-border font-semibold">
              <div>Name</div>
              <div>Category</div>
              <div>Price</div>
              <div>Available</div>
              <div>Actions</div>
            </div>

            {/* Sample Menu Items */}
            {['Jollof Rice', 'Puff Puff', 'Fullhouse Box', 'Grilled Lamb'].map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 gap-4 p-4 border-b border-border items-center hover:bg-secondary/50 transition"
              >
                <div>{item}</div>
                <div className="text-sm text-muted-foreground">
                  {['Mains', 'Pastries', 'Mains', 'Mains'][idx]}
                </div>
                <div className="font-semibold">£{[12.99, 9.99, 18.99, 14.99][idx]}</div>
                <div className="text-green-500">✓ Yes</div>
                <div className="flex gap-2">
                  <button className="text-sm text-orange-500 hover:underline">Edit</button>
                  <button className="text-sm text-destructive hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminGuard>
  )
}
