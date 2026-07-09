'use client'

import { AdminGuard } from '@/components/admin-guard'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Pencil, Trash2, RefreshCw, X, ChefHat } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const CATEGORIES = ['Mains', 'Starters', 'Pastries', 'Cakes', 'Drinks', 'Sides']

interface MenuItem {
  id: string
  name: string
  description?: string | null
  price: number
  category: string
  imageUrl?: string | null
  isAvailable: boolean
}

type FormData = {
  name: string
  description: string
  price: string
  category: string
  imageUrl: string
  isAvailable: boolean
}

const emptyForm: FormData = {
  name: '',
  description: '',
  price: '',
  category: 'Mains',
  imageUrl: '',
  isAvailable: true,
}

function MenuContent() {
  const queryClient = useQueryClient()
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editItem, setEditItem] = useState<MenuItem | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  const { data: items = [], isLoading, refetch } = useQuery<MenuItem[]>({
    queryKey: ['admin-menu'],
    queryFn: async () => {
      const res = await fetch('/api/admin/menu')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const createItem = useMutation({
    mutationFn: async (data: Omit<FormData, 'price' | 'isAvailable'> & { price: number; isAvailable: boolean }) => {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] })
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      setModal(null)
      setForm(emptyForm)
    },
    onError: (e: Error) => setFormError(e.message),
  })

  const updateItem = useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; description?: string; price?: number; category?: string; imageUrl?: string; isAvailable?: boolean }) => {
      const res = await fetch(`/api/admin/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] })
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      setModal(null)
      setEditItem(null)
      setForm(emptyForm)
    },
    onError: (e: Error) => setFormError(e.message),
  })

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] })
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      setDeleteConfirm(null)
    },
  })

  const toggleAvailability = useMutation({
    mutationFn: async ({ id, isAvailable }: { id: string; isAvailable: boolean }) => {
      const res = await fetch(`/api/admin/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable }),
      })
      if (!res.ok) throw new Error('Failed to update')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-menu'] })
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
    },
  })

  const openAdd = () => {
    setForm(emptyForm)
    setFormError('')
    setModal('add')
  }

  const openEdit = (item: MenuItem) => {
    setEditItem(item)
    setForm({
      name: item.name,
      description: item.description ?? '',
      price: String(item.price),
      category: item.category,
      imageUrl: item.imageUrl ?? '',
      isAvailable: item.isAvailable,
    })
    setFormError('')
    setModal('edit')
  }

  const handleSubmit = () => {
    if (!form.name.trim() || !form.price || !form.category) {
      setFormError('Name, price and category are required')
      return
    }
    const priceNum = Number(form.price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid price')
      return
    }

    if (modal === 'add') {
      createItem.mutate({ ...form, price: priceNum })
    } else if (modal === 'edit' && editItem) {
      updateItem.mutate({
        id: editItem.id,
        name: form.name,
        description: form.description,
        price: priceNum,
        category: form.category,
        imageUrl: form.imageUrl,
        isAvailable: form.isAvailable,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 hover:bg-secondary rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">Menu</h1>
              <p className="text-muted-foreground text-sm">Create and manage menu items</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => refetch()} className="p-2 hover:bg-secondary rounded-lg transition">
              <RefreshCw className="w-5 h-5" />
            </button>
            <Button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600 gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Item</span>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No menu items yet</p>
            <Button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600">
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-secondary border-b border-border text-sm font-semibold text-muted-foreground">
              <div className="col-span-2">Name</div>
              <div>Category</div>
              <div>Price</div>
              <div>Available</div>
              <div>Actions</div>
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-2 md:grid-cols-6 gap-3 p-4 border-b border-border items-center hover:bg-secondary/50 transition last:border-0"
              >
                <div className="col-span-2 md:col-span-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex-shrink-0 relative overflow-hidden">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className="px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium">
                    {item.category}
                  </span>
                </div>
                <div className="hidden md:block font-semibold">£{item.price.toFixed(2)}</div>
                <div className="hidden md:block">
                  <button
                    onClick={() => toggleAvailability.mutate({ id: item.id, isAvailable: !item.isAvailable })}
                    className={`px-2 py-1 rounded-full text-xs font-semibold transition ${
                      item.isAvailable
                        ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                    }`}
                  >
                    {item.isAvailable ? 'Available' : 'Hidden'}
                  </button>
                </div>
                <div className="flex gap-2 justify-end md:justify-start">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 hover:bg-orange-500/20 rounded-lg transition text-orange-500"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur z-50 flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-md bg-background border border-border rounded-xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{modal === 'add' ? 'Add Menu Item' : 'Edit Item'}</h2>
              <button onClick={() => { setModal(null); setFormError('') }} className="p-2 hover:bg-secondary rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{formError}</p>
            )}

            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Jollof Rice"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description..."
                  rows={2}
                  className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="price">Price (£) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="12.99"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:border-orange-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="/images/dish.png or https://..."
                  className="mt-1"
                />
              </div>
              {modal === 'edit' && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-sm font-medium">Available for ordering</span>
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setModal(null); setFormError('') }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createItem.isPending || updateItem.isPending}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {createItem.isPending || updateItem.isPending ? 'Saving...' : modal === 'add' ? 'Add Item' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-background border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold">Delete Item?</h2>
            <p className="text-muted-foreground text-sm">
              This will permanently delete the menu item. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => deleteItem.mutate(deleteConfirm)}
                disabled={deleteItem.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                {deleteItem.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminMenu() {
  return (
    <AdminGuard>
      <MenuContent />
    </AdminGuard>
  )
}
