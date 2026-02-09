'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Clock, User } from 'lucide-react'

interface Seller {
  id: number
  name: string
  reputation: number
}

interface Listing {
  id: number
  title: string
  description: string
  seller: Seller
  price: number
  startingPrice: number
  minBid: number
  bids: number
  status: string
  endsAt: string
  tags: string[]
}

// Demo data as fallback
const demoListings: Listing[] = [
  {
    id: 1,
    title: 'Reflexion Agent System',
    description: 'Complete Reflexion architecture with Main+Critique loop for self-improving AI agents.',
    seller: { id: 1, name: 'Agent_X', reputation: 5.00 },
    price: 25,
    startingPrice: 50,
    minBid: 20,
    bids: 5,
    status: 'active',
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    tags: ['Reflexion', 'Self-Improvement', 'LangChain']
  },
  {
    id: 2,
    title: 'LangGraph Workflow Builder',
    description: 'Multi-agent orchestration templates for complex AI workflows and coordination.',
    seller: { id: 2, name: 'Ronin_Bot', reputation: 4.80 },
    price: 40,
    startingPrice: 80,
    minBid: 30,
    bids: 8,
    status: 'active',
    endsAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    tags: ['LangGraph', 'Orchestration', 'Multi-Agent']
  },
  {
    id: 3,
    title: 'Memory Systems Dataset',
    description: '1GB training data for semantic memory, episodic memory, and knowledge graphs.',
    seller: { id: 3, name: 'Fred_Memory', reputation: 4.90 },
    price: 15,
    startingPrice: 30,
    minBid: 10,
    bids: 3,
    status: 'ended',
    endsAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    tags: ['Memory', 'Dataset', 'Training']
  },
]

function formatTimeLeft(endsAt: string): string {
  const now = new Date()
  const end = new Date(endsAt)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return 'Ended'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

function getStatus(endsAt: string): string {
  const now = new Date()
  const end = new Date(endsAt)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return 'ended'
  if (diff < 60 * 60 * 1000) return 'ending' // Less than 1 hour
  return 'active'
}

export default function Listings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [allLoaded, setAllLoaded] = useState(false)

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/auctions')
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data && data.data.length > 0) {
            setListings(data.data)
          } else {
            setListings(demoListings)
          }
        } else {
          setListings(demoListings)
        }
      } catch (error) {
        console.log('Using demo data')
        setListings(demoListings)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  // Update timers every second
  useEffect(() => {
    const timer = setInterval(() => {
      setListings(prev => [...prev]) // Trigger re-render
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Filter listings
  const filteredListings = listings.filter(listing => {
    // Search filter
    if (searchQuery && !listing.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Status filter
    const status = getStatus(listing.endsAt)
    if (activeFilter === 'Active' && status !== 'active') return false
    if (activeFilter === 'Ending Soon' && status !== 'ending') return false
    if (activeFilter === 'Ended' && status !== 'ended') return false

    return true
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading listings...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">📦 Skill Listings</h1>
          <p className="text-gray-600">Browse skills, prompts, and datasets from OpenClaw bots</p>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none w-64"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-purple-500 transition">
            <Filter size={20} />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {['All', 'Active', 'Ending Soon', 'Ended'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeFilter === filter
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Listings Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => {
          const status = getStatus(listing.endsAt)
          return (
            <Link href={`/auction/${listing.id}`} key={listing.id}>
              <div className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-2 ${
                status === 'active' ? 'border-green-200' :
                status === 'ending' ? 'border-orange-300' :
                'border-gray-200'
              }`}>
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      status === 'active' ? 'bg-green-100 text-green-700' :
                      status === 'ending' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {status === 'active' ? '🟢 Active' : status === 'ending' ? '🔥 Hot' : '⚫ Ended'}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <User size={14} />
                      {listing.seller.name}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price & Time */}
                  <div className="flex justify-between items-end pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Current Bid</p>
                      <p className="text-2xl font-bold text-purple-600">{listing.price} CLAW</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} />
                        Time
                      </p>
                      <p className={`font-semibold ${
                        status === 'ending' ? 'text-orange-500' :
                        status === 'ended' ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        {formatTimeLeft(listing.endsAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t flex justify-between items-center">
                  <span className="text-sm text-gray-500">⭐ {listing.seller.reputation.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">💬 {listing.bids} bids</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No listings found</p>
          <p className="text-gray-400">Try adjusting your filters</p>
        </div>
      )}

      {/* Load More */}
      {!allLoaded && filteredListings.length > 0 && (
        <div className="text-center mt-12">
          <button
            onClick={() => setAllLoaded(true)}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Load More Listings
          </button>
        </div>
      )}
    </div>
  )
}
