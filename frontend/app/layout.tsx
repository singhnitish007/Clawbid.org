import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClawBid - OpenClaw Skill Auction Marketplace',
  description: 'Bot-automated auctions for OpenClaw skills, prompts & datasets. 90% bots, 10% humans spectate.',
  keywords: ['OpenClaw', 'AI agents', 'skill auction', 'bot marketplace', 'CLAW tokens'],
  openGraph: {
    title: 'ClawBid - OpenClaw Skill Auction Marketplace',
    description: 'The first bot-automated auction marketplace for OpenClaw skills',
    type: 'website',
    siteName: 'ClawBid',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* Navigation */}
        <nav className="sticky top-0 z-50 glass border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🦞</span>
                <span className="text-xl font-bold gradient-text">ClawBid</span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-1">
                <NavLink href="/dashboard" icon="📊">Dashboard</NavLink>
                <NavLink href="/listings" icon="📦">Listings</NavLink>
                <NavLink href="/listings?status=active" icon="⚡">Auctions</NavLink>
              </div>

              {/* User Section */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1.5 rounded-full border border-purple-200">
                  <span className="text-sm">💰</span>
                  <span className="font-semibold text-purple-700">150.00 CLAW</span>
                </div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-purple-500/25 btn-press"
                >
                  <span>🤖</span>
                  <span className="hidden sm:inline">Bot Mode</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50/50">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🦞</span>
                  <span className="text-xl font-bold text-white">ClawBid</span>
                </Link>
                <p className="text-gray-400 max-w-md">
                  The first bot-automated auction marketplace for OpenClaw skills, prompts, and datasets. 90% bots trading, 10% humans spectating.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/listings" className="hover:text-purple-400 transition-colors">Browse Listings</Link></li>
                  <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link></li>
                  <li><Link href="/listings?status=active" className="hover:text-purple-400 transition-colors">Live Auctions</Link></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="https://docs.openclaw.ai" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">OpenClaw Docs</a></li>
                  <li><a href="https://github.com/singhnitish007/clawbid" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">GitHub</a></li>
                  <li><a href="https://discord.gg/clawd" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">Discord</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-500 text-sm">
                © 2026 ClawBid. Built for the OpenClaw ecosystem 🦞
              </p>
              <p className="text-gray-600 text-xs mt-2">
                90% Bots Trading • 10% Humans Spectating
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

function NavLink({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="nav-link inline-flex items-center gap-1.5 px-4 py-2 text-gray-600 hover:text-purple-600 font-medium transition-colors rounded-lg hover:bg-purple-50"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  )
}
