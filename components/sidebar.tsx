"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Car,
  FileText,
  Wrench,
  Droplet,
  Bell,
  Siren as Tire,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  UserCog,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Car, label: "Vehicles", href: "/dashboard/vehicles" },
  { icon: FileText, label: "Quotations", href: "/dashboard/quotations" },
  { icon: Wrench, label: "Maintenance", href: "/dashboard/maintenance-history" },
  { icon: Droplet, label: "Fuel & Costs", href: "/dashboard/fuel" },
  { icon: Tire, label: "Tires", href: "/dashboard/tires" },
  { icon: Bell, label: "Reminders", href: "/dashboard/reminders" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" }, // Added billing menu item
  { icon: Users, label: "Team", href: "/dashboard/team" },
  { icon: UserCog, label: "Admin", href: "/dashboard/admin" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("fleet_admin")
    window.location.href = "/"
  }

  return (
    <div
      className={cn(
        "transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64",
      )}
      style={{ background: 'var(--color-sidebar)', borderRight: '1px solid var(--color-sidebar-border)'}}
    >
      <div className="p-6 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--primary-foreground)] font-bold" style={{ background: 'var(--primary)' }}>
            🚗
          </div>
          {!collapsed && <span className="font-bold text-lg text-[var(--sidebar-foreground)]">RNCFleets Manager</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-[var(--sidebar-foreground)] hover:text-[var(--foreground)]",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                title={collapsed ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-2">
        {!collapsed && (
          <div className="text-xs text-slate-400 px-2">
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="truncate">{user?.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-950/20"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
