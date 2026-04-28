"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import config from "@/lib/config";
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

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-white/[0.08] bg-brand-surface-light shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command
          label="Command Menu"
          className="flex flex-col"
          loop
        >
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4">
            <Search className="size-4 text-white/40" />
            <Command.Input
              placeholder="Search or jump to..."
              className="flex h-12 w-full bg-transparent py-3 text-sm text-white placeholder:text-white/40 outline-none"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex items-center rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-white/50">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-white/40">
              No results found.
            </Command.Empty>
            <Command.Group
              heading="Navigation"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-white/40"
            >
              {config.dashboard.navItems.map((item) => {
                const Icon = iconMap[item.icon] ?? LayoutDashboard;
                return (
                  <Command.Item
                    key={item.href}
                    value={`${item.label} ${item.href}`}
                    onSelect={() => go(item.href)}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 aria-selected:bg-white/10 aria-selected:text-white data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
                  >
                    <Icon className="size-4 text-white/50" />
                    <span>{item.label}</span>
                    <span className="ml-auto text-xs text-white/30">
                      {item.href}
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
          <div className="flex items-center justify-between border-t border-white/[0.06] px-3 py-2 text-xs text-white/40">
            <span>
              <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono">
                ↑↓
              </kbd>{" "}
              to navigate
            </span>
            <span>
              <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono">
                ↵
              </kbd>{" "}
              to select
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}

export function CommandPaletteTrigger({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-left text-sm text-white/40 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white/60 transition-colors"
    >
      <Search className="size-4" />
      <span className="flex-1">Search...</span>
      <kbd className="inline-flex items-center rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-white/50">
        ⌘K
      </kbd>
    </button>
  );
}
