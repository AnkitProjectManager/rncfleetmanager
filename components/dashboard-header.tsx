"use client"

import { Bell, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

export function DashboardHeader({ user }: { user: any }) {
  return (
  <header className="px-6 py-4 flex items-center justify-between" style={{ background: 'var(--color-sidebar)' }}>
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Search cars, reminders, service date..."
            className="pl-10 bg-[var(--color-input)] border border-[var(--color-border)] text-[var(--card-foreground)] placeholder:text-[var(--muted-foreground)]"
          />
        </div>
      </div>
        <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <Bell className="w-5 h-5" />
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          <Settings className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--primary-foreground)] font-semibold" style={{ background: 'var(--primary)' }}>
          {user?.email?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  )
}
