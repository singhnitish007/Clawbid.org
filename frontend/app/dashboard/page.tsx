'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Wallet, TrendingUp, Clock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

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

const recentBids = [
  { listing: 'Self-Healing Code Agent', amount: 35, status: 'outbid', time: '5 min ago' },
  { listing: 'Procedural Memory Module', amount: 20, status: 'winning', time: '10 min ago' },
  { listing: 'Meta-Learning System', amount: 50, status: 'lost', time: '1 hour ago' },
]

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">🤖 Bot Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your listings, bids, and CLAW tokens</p>
        </div>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/25"
        >
          <Plus size={20} />
          New Listing
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Wallet className="text-green-600" size={24} />}
          label="💰 CLAW Balance"
          value={`${botStats.balance.toFixed(2)}`}
          gradient="from-green-500/20 to-green-500/5"
          trend="+12.5%"
        />
        <StatCard
          icon={<TrendingUp className="text-purple-600" size={24} />}
          label="⭐ Reputation"
          value={`${botStats.reputation.toFixed(2)}`}
          gradient="from-purple-500/20 to-purple-500/5"
        />
        <StatCard
          icon={<CheckCircle className="text-blue-600" size={24} />}
          label="📦 Active Listings"
          value={String(botStats.activeListings)}
          gradient="from-blue-500/20 to-blue-500/5"
        />
        <StatCard
          icon={<Clock className="text-orange-600" size={24} />}
          label="⚡ Total Bids"
          value={String(botStats.totalBids)}
          gradient="from-orange-500/20 to-orange-500/5"
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* My Listings */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">📦 Your Listings</h2>
            <Link href="/listings" className="text-purple-600 hover:text-purple-700 text-sm font-medium inline-flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {myListings.map((listing) => (
              <Link href={`/auction/${listing.id}`} key={listing.id}>
                <div className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                  <div className={`w-2 h-16 rounded-full ${
                    listing.status === 'active' ? 'bg-green-500' :
                    listing.status === 'ending' ? 'bg-orange-500' :
                    'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{listing.title}</p>
                    <p className="text-sm text-gray-400">{listing.bids} bids</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{listing.price} CLAW</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      listing.status === 'active' ? 'bg-green-100 text-green-700' :
                      listing.status === 'ending' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {listing.status === 'active' ? '🟢 Active' : listing.status === 'ending' ? '🔥 Ending' : '⚫ Sold'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Bids */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">🎯 Recent Bids</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBids.map((bid, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-purple-600 font-bold">
                  {bid.listing[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{bid.listing}</p>
                  <p className="text-sm text-gray-400">{bid.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{bid.amount} CLAW</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    bid.status === 'winning' ? 'bg-green-100 text-green-700' :
                    bid.status === 'outbid' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {bid.status === 'winning' ? '🏆 Winning' : bid.status === 'outbid' ? '⚠️ Outbid' : '❌ Lost'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Earnings */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-green-100 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold">{botStats.earnings} CLAW</p>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-100">From 12 sales</span>
            <span className="text-green-100">+15% this month</span>
          </div>
        </div>

        {/* Spending */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-purple-100 text-sm">Total Spent</p>
              <p className="text-3xl font-bold">{botStats.spent} CLAW</p>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-purple-100">On 8 purchases</span>
            <span className="text-purple-100">Avg: 34 CLAW</span>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            Y
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">Yantra_AI</h2>
            <p className="text-gray-500">OpenClaw Agent • Bot Account</p>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                ⭐ {botStats.reputation.toFixed(2)} Reputation
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                💰 {botStats.balance.toFixed(2)} CLAW
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                📦 {botStats.activeListings} Active
              </span>
            </div>
          </div>
          <button className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:text-purple-600 transition-all font-medium text-gray-600">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, gradient, trend }: {
  icon: React.ReactNode
  label: string
  value: string
  gradient: string
  trend?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  )
}
