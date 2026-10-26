'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AdminGuard } from '@/components/admin-guard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Loader2, Plus, Tags, Trash2 } from 'lucide-react'

type Category = { id: string | null; name: string; itemCount: number }

function CategoriesManager() {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const categories = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await fetch('/api/admin/categories')
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to load categories')
      return result
    },
  })
  const createCategory = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to create category')
      return result as Category
    },
    onSuccess: async () => { setName(''); setError(''); await queryClient.invalidateQueries({ queryKey: ['admin-categories'] }); await queryClient.invalidateQueries({ queryKey: ['menu-categories'] }) },
    onError: (reason: Error) => setError(reason.message),
  })
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to delete category')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-categories'] }),
    onError: (reason: Error) => setError(reason.message),
  })

  return <main className="min-h-screen bg-secondary/60 px-4 py-7 text-foreground sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl">
    <header className="mb-7 flex items-center gap-3"><Link href="/admin" aria-label="Back to dashboard" className="rounded-xl border border-border bg-card p-2.5 hover:bg-secondary"><ArrowLeft className="h-5 w-5" /></Link><div><h1 className="text-3xl font-bold">Food categories</h1><p className="mt-1 text-sm text-muted-foreground">Create categories and organize individual dishes, including meat items ordered on their own.</p></div></header>

    <form onSubmit={(event) => { event.preventDefault(); setError(''); createCategory.mutate() }} className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:flex-row">
      <Input aria-label="New category name" placeholder="e.g. Meat, Seafood, Vegan" maxLength={100} value={name} onChange={(event) => setName(event.target.value)} required />
      <Button disabled={createCategory.isPending || !name.trim()} className="gap-2"><Plus className="h-4 w-4" />{createCategory.isPending ? 'Creating…' : 'Add category'}</Button>
    </form>
    {error && <p role="alert" className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><div className="border-b border-border p-5"><h2 className="font-semibold">Available categories</h2><p className="text-sm text-muted-foreground">Categories with products stay available to customers in the menu.</p></div>
      {categories.isLoading ? <div className="flex justify-center p-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div> : categories.isError ? <div className="p-6 text-center"><p className="text-sm text-destructive">Could not load categories.</p><Button variant="outline" className="mt-3" onClick={() => categories.refetch()}>Try again</Button></div> : <div className="divide-y divide-border">{(categories.data ?? []).map((category) => <div key={category.id ?? category.name} className="flex items-center justify-between gap-4 p-4"><div className="flex items-center gap-3"><span className="rounded-xl bg-primary/15 p-2.5 text-primary"><Tags className="h-4 w-4" /></span><div><p className="font-medium">{category.name}</p><p className="text-xs text-muted-foreground">{category.itemCount} menu {category.itemCount === 1 ? 'item' : 'items'}</p></div></div>{category.id && category.itemCount === 0 && <Button variant="ghost" size="icon" aria-label={`Delete ${category.name}`} disabled={deleteCategory.isPending} onClick={() => { setError(''); deleteCategory.mutate(category.id!) }} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>}</div>)}</div>}
    </section>
  </div></main>
}

export default function AdminCategoriesPage() { return <AdminGuard><CategoriesManager /></AdminGuard> }
