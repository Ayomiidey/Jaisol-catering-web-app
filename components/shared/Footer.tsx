import Link from 'next/link'
import { UtensilsCrossed } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Menu' },
  { href: '/book', label: 'Catering' },
  { href: '/explore', label: 'Cakes' },
  { href: '/about', label: 'About' },
]

const socials = [
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0-2.2C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.8.31-1.48.72-2.15 1.4C1.32 2.7.9 3.38.6 4.18c-.3.76-.5 1.64-.56 2.91C0 8.37 0 8.78 0 12s0 3.63.06 4.9c.06 1.27.26 2.15.56 2.91.3.8.72 1.48 1.4 2.15.67.68 1.35 1.1 2.15 1.4.76.3 1.64.5 2.91.56C8.37 24 8.78 24 12 24s3.63 0 4.9-.06c1.27-.06 2.15-.26 2.91-.56.8-.3 1.48-.72 2.15-1.4.68-.67 1.1-1.35 1.4-2.15.3-.76.5-1.64.56-2.91.06-1.27.06-1.68.06-4.9s0-3.63-.06-4.9c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.4-2.15A5.9 5.9 0 0 0 19.81.63c-.76-.3-1.64-.5-2.91-.56C15.63.01 15.22 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
      </svg>
    ),
  },
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
      </svg>
    ),
  },
  {
    href: 'https://tiktok.com',
    label: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M16.6 5.82c-1-.99-1.56-2.34-1.56-3.82h-3.03v14.06a2.6 2.6 0 1 1-1.83-2.48V10.5a5.6 5.6 0 1 0 4.86 5.56V9.4a7.5 7.5 0 0 0 4.6 1.55V7.93a4.6 4.6 0 0 1-3.04-2.1z" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="bg-[#171922] text-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#9ED061] flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-[#171922]" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-sm">JAISOL</p>
              <p className="text-[10px] text-[#DA231D] font-semibold tracking-wide">CATERING</p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            {links.map((l) => (
              <Link key={l.label} href={l.href} className="text-white/70 hover:text-white transition">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#9ED061] hover:text-[#171922] transition"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Jaisol Catering. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/40">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}