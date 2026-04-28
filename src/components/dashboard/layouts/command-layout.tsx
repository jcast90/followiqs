"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import config from "@/lib/config";
import { UserMenu } from "@/components/dashboard/user-menu";
import {
  CommandPalette,
  CommandPaletteTrigger,
} from "@/components/dashboard/layouts/command-palette";
import {
  LayoutDashboard,
  Settings,
  Database,
  Zap,
  Users,
  BarChart3,
  FileText,
  Globe,
  Scale,
  Shield,
  Briefcase,
  Calendar,
  Mail,
  MessageSquare,
  Bell,
  Search,
  Home,
  FolderOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Building,
  Phone,
  Star,
  Heart,
  Tag,
  Inbox,
  Send,
  PieChart,
  Activity,
  Package,
  Truck,
  ShoppingCart,
  Clipboard,
  BookOpen,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Settings, Database, Zap, Users, BarChart3, FileText, Globe,
  Scale, Shield, Briefcase, Calendar, Mail, MessageSquare, Bell, Search, Home,
  FolderOpen, Clock, CheckCircle, AlertTriangle, TrendingUp, DollarSign,
  Building, Phone, Star, Heart, Tag, Inbox, Send, PieChart, Activity, Package,
  Truck, ShoppingCart, Clipboard, BookOpen, CreditCard,
};

export function CommandLayout({ children }: { children: React.ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Minimal rail sidebar - icon-only on desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[64px] flex-col items-center border-r border-white/[0.06] bg-brand-surface-light py-4 lg:flex">
        <div
          className="absolute inset-y-0 left-0 w-[2px]"
          style={{ background: `linear-gradient(to bottom, var(--brand-primary), var(--brand-accent))` }}
        />
        <Link
          href="/dashboard"
          className="flex size-10 items-center justify-center rounded-lg transition-transform hover:scale-105"
          style={{ background: "linear-gradient(to bottom right, var(--brand-primary), var(--brand-accent))" }}
        >
          <Zap className="size-5 text-white" />
        </Link>

        <nav className="mt-6 flex flex-1 flex-col items-center gap-1">
          {config.dashboard.navItems.map((item) => {
            const Icon = iconMap[item.icon] ?? LayoutDashboard;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`group relative flex size-10 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:bg-white/[0.06] hover:text-white/80"
                }`}
              >
                <Icon className="size-[18px]" />
                <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md border border-white/10 bg-brand-surface-light px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-50">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <UserMenu variant="sidebar" />
        </div>
      </aside>

      {/* Mobile header with palette trigger */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-white/[0.06] px-4 backdrop-blur-xl lg:hidden" style={{ backgroundColor: "color-mix(in srgb, var(--brand-surface) 80%, transparent)" }}>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg" style={{ background: "linear-gradient(to bottom right, var(--brand-primary), var(--brand-accent))" }}>
            <Zap className="size-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">{config.name}</span>
        </Link>
        <div className="ml-auto">
          <UserMenu variant="header" />
        </div>
      </header>

      {/* Desktop top bar with command trigger */}
      <div className="sticky top-0 z-20 hidden h-14 items-center border-b border-white/[0.06] backdrop-blur-xl lg:flex lg:pl-[64px]" style={{ backgroundColor: "color-mix(in srgb, var(--brand-surface) 80%, transparent)" }}>
        <div className="flex-1 max-w-xl px-6">
          <CommandPaletteTrigger onClick={() => setPaletteOpen(true)} />
        </div>
      </div>

      <main className="lg:pl-[64px]">
        <div className="min-h-screen">{children}</div>
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
