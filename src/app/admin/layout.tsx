"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard, Users, CreditCard, Briefcase, BarChart3,
  HeadphonesIcon, Settings, TrendingUp, Menu, X, ChevronRight,
  Bell, Search, Sparkles, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const NAV_ITEMS = [
  { href: "/admin",            label: "Dashboard",   icon: LayoutDashboard, badge: null },
  { href: "/admin/leads",      label: "Leads",       icon: Users,           badge: "24" },
  { href: "/admin/payments",   label: "Payments",    icon: CreditCard,      badge: null },
  { href: "/admin/employees",  label: "Employees",   icon: Briefcase,       badge: null },
  { href: "/admin/analytics",  label: "Analytics",   icon: BarChart3,       badge: null },
  { href: "/admin/users",      label: "Users",       icon: Users,           badge: null },
  { href: "/admin/support",    label: "Support",     icon: HeadphonesIcon,  badge: "7" },
  { href: "/admin/settings",   label: "Settings",    icon: Settings,        badge: null },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-black text-sm text-foreground">Admin Panel</div>
            <div className="text-xs text-muted-foreground">Startup India 2026</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge className={`text-xs h-5 px-1.5 ${active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                      {item.badge}
                    </Badge>
                  )}
                  {active && <ChevronRight className="w-3 h-3 opacity-60" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold truncate">Admin User</div>
              <div className="text-xs text-muted-foreground">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center gap-4 px-6 sticky top-0 z-30">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden -ml-2">
            <Menu className="w-5 h-5" />
          </Button>

          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search leads, users, payments..." className="pl-9 h-9 bg-background text-sm" />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <Sparkles className="w-3 h-3" /> View Site
              </Button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
