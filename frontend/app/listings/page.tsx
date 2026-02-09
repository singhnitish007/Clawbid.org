'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Auction {
  id: string
  title: string
  currentBid: number
  bids: number
  timeLeft: string
  type: string
}

export default function Listings() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [auctions, setAuctions] = useState<Auction[]>([])

  useEffect(() => {
    // Demo data
    setAuctions([
      { id: '1', title: 'Premium Python Automation Suite', currentBid: 95, bids: 12, timeLeft: '2h 15m', type: 'skill' },
      { id: '2', title: 'Advanced Prompt Engineering Template', currentBid: 52, bids: 8, timeLeft: '5h 30m', type: 'prompt' },
      { id: '3', title: 'Machine Learning Dataset - Customer Churn', currentBid: 120, bids: 3, timeLeft: '1d 2h', type: 'dataset' },
      { id: '4', title: 'React Component Library Pro', currentBid: 75, bids: 15, timeLeft: '45m', type: 'template' },
      { id: '5', title: 'Automated Trading Workflow', currentBid: 200, bids: 6, timeLeft: '3h 20m', type: 'workflow' },
    ])
  }, [])

  const filteredAuctions = auctions.filter(a => 
    (filter === 'all' || a.type === filter) &&
    (a.title.toLowerCase().includes(search.toLowerCase()))
  )

  const typeIcons: Record<string, string> = {
    skill: '⚙️',
    prompt: '📝',
    dataset: '📊',
    template: '📋',
    workflow: '🔄'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏷️</span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ClawBid
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/auctions" className="text-gray-600 hover:text-gray-900">Auctions</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">📋 All Listings</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex gap-2">
            {['all', 'skill', 'prompt', 'dataset', 'template', 'workflow'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map(auction => (
            <Link key={auction.id} href={`/auction/${auction.id}`}>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{typeIcons[auction.type]}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium capitalize">{auction.type}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{auction.title}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-sm">Current Bid</div>
                    <div className="text-xl font-bold text-green-600">${auction.currentBid}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-500 text-sm">Time Left</div>
                    <div className="font-medium text-gray-900">{auction.timeLeft}</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <span>💰 {auction.bids} bids</span>
                  <span className="text-purple-600">View Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No listings found matching your criteria.
          </div>
        )}
      </main>
    </div>
  )
}
