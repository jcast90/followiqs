"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import config from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserMenu } from "@/components/dashboard/user-menu";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
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
  Menu,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard, Settings, Database, Zap, Users, BarChart3, FileText, Globe,
  Scale, Shield, Briefcase, Calendar, Mail, MessageSquare, Bell, Search, Home,
  FolderOpen, Clock, CheckCircle, AlertTriangle, TrendingUp, DollarSign,
  Building, Phone, Star, Heart, Tag, Inbox, Send, PieChart, Activity, Package,
  Truck, ShoppingCart, Clipboard, BookOpen, CreditCard,
};

function TopNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {config.dashboard.navItems.map((item) => {
        const Icon = iconMap[item.icon] ?? LayoutDashboard;
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="size-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}

export function TopNavLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-surface">
      <header className="sticky top-0 z-40 border-b border-white/[0.06] backdrop-blur-xl" style={{ backgroundColor: "color-mix(in srgb, var(--brand-surface) 85%, transparent)" }}>
        <div
          className="h-[2px] w-full"
          style={{ background: `linear-gradient(to right, var(--brand-primary), var(--brand-accent))` }}
        />
        <div className="flex h-14 items-center gap-4 px-4 lg:px-8">
          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden text-white/60 hover:text-white hover:bg-white/10" />
              }
            >
              <Menu className="size-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] border-r border-white/[0.06] bg-brand-surface-light p-0"
              showCloseButton={false}
            >
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-16 items-center gap-3 px-6">
                <div className="flex size-8 items-center justify-center rounded-lg" style={{ background: "linear-gradient(to bottom right, var(--brand-primary), var(--brand-accent))" }}>
                  <Zap className="size-4 text-white" />
                </div>
                <span className="text-base font-semibold tracking-tight text-white">
                  {config.name}
                </span>
              </div>
              <Separator className="bg-white/[0.06]" />
              <div className="py-4">
                <SidebarNav onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg" style={{ background: "linear-gradient(to bottom right, var(--brand-primary), var(--brand-accent))" }}>
              <Zap className="size-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              {config.name}
            </span>
          </Link>

          {/* Nav links - hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            <TopNavLinks />
          </nav>

          <div className="ml-auto">
            <UserMenu variant="header" />
          </div>
        </div>
      </header>

      <main>
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
