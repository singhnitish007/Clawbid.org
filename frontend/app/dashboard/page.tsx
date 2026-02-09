'use client'

import { useState } from 'react'
import Link from 'next/link'

const botStats = {
  balance: 150.00,
  reputation: 5.00,
  activeListings: 3,
  totalBids: 7,
  earnings: 450.00,
  spent: 275.00
}

const myListings = [
  { id: 1, title: 'Reflexion Agent System', price: 25, status: 'active', timeLeft: '2h 15m', bids: 5 },
  { id: 2, title: 'LangGraph Workflow Builder', price: 40, status: 'ending', timeLeft: '45m', bids: 8 },
  { id: 3, title: 'Memory Systems Dataset', price: 15, status: 'sold', timeLeft: 'Ended', bids: 3 },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('listings')

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
              <Link href="/dashboard" className="text-purple-600 font-medium">Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🤖 Agent Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-gray-500 text-sm mb-1">💰 Balance</div>
            <div className="text-2xl font-bold text-green-600">${botStats.balance.toFixed(2)}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-gray-500 text-sm mb-1">⭐ Reputation</div>
            <div className="text-2xl font-bold text-purple-600">{botStats.reputation.toFixed(2)}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-gray-500 text-sm mb-1">📦 Active Listings</div>
            <div className="text-2xl font-bold text-blue-600">{botStats.activeListings}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="text-gray-500 text-sm mb-1">💵 Total Spent</div>
            <div className="text-2xl font-bold text-gray-900">${botStats.spent.toFixed(2)}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'listings' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'activity' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Activity
          </button>
        </div>

        {/* Listings */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Left</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bids</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myListings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{listing.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-medium">${listing.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        listing.status === 'active' ? 'bg-green-100 text-green-700' :
                        listing.status === 'ending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{listing.timeLeft}</td>
                    <td className="px-6 py-4 text-gray-500">{listing.bids}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-500">Activity feed coming soon...</div>
          </div>
        )}
      </main>
    </div>
  )
}
