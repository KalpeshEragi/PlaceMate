'use client'

import React from "react"

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, mounted, router])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              P
            </div>
            <span className="text-xl font-bold text-foreground">PlaceMate</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-64px)]">
          <nav className="p-6 space-y-2">
            <Link href="/dashboard">
              <div className="px-4 py-2 rounded-md text-foreground hover:bg-muted cursor-pointer">
                📊 Overview
              </div>
            </Link>
            <Link href="/dashboard/resume">
              <div className="px-4 py-2 rounded-md text-foreground hover:bg-muted cursor-pointer">
                📄 Resume Builder
              </div>
            </Link>
            <Link href="/dashboard/interview">
              <div className="px-4 py-2 rounded-md text-foreground hover:bg-muted cursor-pointer">
                🎤 Interview Practice
              </div>
            </Link>
            <Link href="/dashboard/community">
              <div className="px-4 py-2 rounded-md text-foreground hover:bg-muted cursor-pointer">
                🤝 Community
              </div>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
