import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, BarChart3, Images, LayoutDashboard, ShoppingBag, Tags, Utensils, UtensilsCrossed } from 'lucide-react'
import { AdminDashboardStats } from './stats-client'

const sections = [
  { href: '/admin/orders', title: 'Orders', detail: 'Review orders and update fulfillment', icon: ShoppingBag },
  { href: '/admin/bookings', title: 'Catering bookings', detail: 'Respond to upcoming events', icon: UtensilsCrossed },
  { href: '/admin/menu', title: 'Menu', detail: 'Update dishes, availability and prices', icon: Utensils },
  { href: '/admin/categories', title: 'Categories', detail: 'Create categories such as Meat or Seafood', icon: Tags },
  { href: '/admin/analytics', title: 'Analytics', detail: 'Track sales and popular items', icon: BarChart3 },
  { href: '/admin/carousel', title: 'Homepage slides', detail: 'Manage offers shown to customers', icon: Images },
]

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user) redirect('/sign-in?callbackUrl=/admin')
  if (!session.user.isAdmin) redirect('/')

  return (
    <main className="min-h-screen bg-secondary/60 px-4 py-7 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary/20 p-3 text-primary"><LayoutDashboard className="h-6 w-6" /></div>
            <div><p className="text-sm font-semibold text-primary">JAISOL CATERING</p><h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Admin dashboard</h1><p className="mt-2 text-muted-foreground">Good to see you, {session.user.name || 'Admin'}. Here’s what needs your attention.</p></div>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:bg-secondary">View customer site <ArrowUpRight className="h-4 w-4" /></Link>
        </header>

        <section aria-label="Business overview" className="mb-8"><AdminDashboardStats /></section>

        <section>
          <div className="mb-4"><h2 className="text-xl font-bold">Manage your business</h2><p className="mt-1 text-sm text-muted-foreground">Choose a workspace to continue.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sections.map(({ href, title, detail, icon: Icon }) => (
              <Link key={href} href={href} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="flex items-start justify-between"><span className="rounded-xl bg-primary/15 p-3 text-primary"><Icon className="h-5 w-5" /></span><ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" /></div>
                <h3 className="mt-5 font-semibold">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{detail}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
