'use client'

import { AdminGuard } from '@/components/admin-guard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ImagePlus, Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

type Slide = { id: string; title: string; description: string | null; imageUrl: string; link: string | null; sortOrder: number; isActive: boolean }
type Form = { title: string; description: string; imageUrl: string; link: string; sortOrder: string; isActive: boolean }
const emptyForm: Form = { title: '', description: '', imageUrl: '', link: '/explore', sortOrder: '0', isActive: true }

function CarouselManager() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<Slide | null>(null)
  const [form, setForm] = useState<Form>(emptyForm)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const { data: slides = [], isLoading, refetch } = useQuery<Slide[]>({
    queryKey: ['admin-carousel'],
    queryFn: async () => {
      const response = await fetch('/api/admin/carousel')
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to load slides')
      return result.data
    },
  })
  const save = useMutation({
    mutationFn: async ({ id, data }: { id?: string; data: Form }) => {
      let imageUrl = data.imageUrl.trim()
      if (file) {
        const upload = new FormData(); upload.append('file', file)
        const response = await fetch('/api/admin/upload', { method: 'POST', body: upload })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Image upload failed')
        imageUrl = result.url
      }
      const response = await fetch(id ? `/api/admin/carousel/${id}` : '/api/admin/carousel', {
        method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, imageUrl, sortOrder: Number(data.sortOrder) || 0, type: 'homepage' }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to save slide')
      return result.data
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-carousel'] }); setOpen(false); setEditing(null); setForm(emptyForm); setFile(null) },
    onError: (reason: Error) => setError(reason.message),
  })
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/carousel/${id}`, { method: 'DELETE' })
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Failed to delete slide')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-carousel'] }),
    onError: (reason: Error) => setError(reason.message),
  })
  const edit = (slide?: Slide) => {
    setEditing(slide ?? null); setError(''); setFile(null)
    setForm(slide ? { title: slide.title, description: slide.description ?? '', imageUrl: slide.imageUrl, link: slide.link ?? '', sortOrder: String(slide.sortOrder), isActive: slide.isActive } : emptyForm)
    setOpen(true)
  }
  return <div className="min-h-screen bg-background p-4 text-foreground md:p-6"><div className="mx-auto max-w-6xl">
    <div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-3"><Link href="/admin" className="rounded-lg p-2 hover:bg-secondary"><ArrowLeft className="h-5 w-5" /></Link><div><h1 className="text-2xl font-bold md:text-4xl">Homepage carousel</h1><p className="text-sm text-muted-foreground">Manage promotional banners on your homepage.</p></div></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={() => refetch()}><RefreshCw className="h-4 w-4" /></Button><Button className="bg-orange-500 hover:bg-orange-600" onClick={() => edit()}><Plus /> Add slide</Button></div></div>
    {error && <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
    {isLoading ? <div className="py-12 text-center text-muted-foreground">Loading slides…</div> : slides.length === 0 ? <div className="rounded-xl border border-dashed border-border py-16 text-center"><ImagePlus className="mx-auto mb-3 h-10 w-10 text-orange-500" /><p className="font-semibold">No homepage slides yet</p><Button className="mt-4 bg-orange-500 hover:bg-orange-600" onClick={() => edit()}>Create your first slide</Button></div> : <div className="grid gap-4 md:grid-cols-2">{slides.map((slide) => <div key={slide.id} className="overflow-hidden rounded-xl border border-border bg-secondary"><div className="relative aspect-[16/7]"><Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" /><span className={`absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-bold ${slide.isActive ? 'bg-green-500 text-white' : 'bg-black/60 text-white'}`}>{slide.isActive ? 'Active' : 'Hidden'}</span></div><div className="p-4"><div className="flex justify-between gap-3"><div><h2 className="font-bold">{slide.title}</h2><p className="mt-1 text-sm text-muted-foreground">{slide.description}</p><p className="mt-2 text-xs text-muted-foreground">Order: {slide.sortOrder} · Link: {slide.link || 'None'}</p></div><div className="flex h-fit gap-1"><Button size="icon" variant="outline" onClick={() => edit(slide)}><Pencil /></Button><Button size="icon" variant="outline" className="text-red-400" disabled={remove.isPending} onClick={() => remove.mutate(slide.id)}><Trash2 /></Button></div></div></div></div>)}</div>}
    {open && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 md:items-center"><div className="w-full max-w-lg space-y-4 rounded-xl border border-border bg-background p-6"><div className="flex justify-between"><h2 className="text-xl font-bold">{editing ? 'Edit slide' : 'Add slide'}</h2><Button size="icon" variant="ghost" onClick={() => setOpen(false)}><X /></Button></div><div><Label>Headline *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div><div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div><div><Label>Image URL</Label><Input placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div><div><Label>Or upload an image</Label><Input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></div><div className="grid grid-cols-2 gap-3"><div><Label>Button link</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/explore" /></div><div><Label>Display order</Label><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></div></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Show this slide on the homepage</label><Button className="w-full bg-orange-500 hover:bg-orange-600" disabled={save.isPending} onClick={() => save.mutate({ id: editing?.id, data: form })}>{save.isPending ? 'Saving…' : 'Save slide'}</Button></div></div>}
  </div></div>
}

export default function AdminCarouselPage() { return <AdminGuard><CarouselManager /></AdminGuard> }
