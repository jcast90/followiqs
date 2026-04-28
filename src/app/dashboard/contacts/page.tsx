"use client";

import { useEffect, useState } from "react";
import {
  PageShell,
  PageHeader,
  StatsGrid,
  SearchInput,
  DataTable,
  LoadingState,
  EmptyState,
  FormDialog,
  FormField,
  ThemedInput,
  GradientButton,
  StatusBadge,
} from "@/components/blocks";
import type { Column } from "@/components/blocks";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRows, insertRow, updateRow, deleteRow } from "@/lib/supabase/db";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";

interface Contacts {
  [key: string]: unknown;
  id: string;
  name: string;
  email: string;
  status: string;
  revenue?: number;
  last_contacted?: string;
  created_at: string;
  updated_at: string;
}

// VOS-209: stable ISO strings; calling new Date() in module init under
// "use client" still runs on the server during SSR AND again on the
// client, producing different strings. Freeze to a constant so the
// hydration checksum matches.
const SAMPLE_TS = "2025-01-01T00:00:00.000Z";
const SAMPLE: Contacts[] = [
  { id: "1", name: "Name 1", email: "user1@example.com", status: "active", revenue: 1250.50, last_contacted: SAMPLE_TS, created_at: SAMPLE_TS, updated_at: SAMPLE_TS },
  { id: "2", name: "Name 2", email: "user2@example.com", status: "inactive", revenue: 2501.00, last_contacted: SAMPLE_TS, created_at: SAMPLE_TS, updated_at: SAMPLE_TS },
  { id: "3", name: "Name 3", email: "user3@example.com", status: "lead", revenue: 3751.50, last_contacted: SAMPLE_TS, created_at: SAMPLE_TS, updated_at: SAMPLE_TS }
];

// VOS-209: pin locale + timezone so SSR/client agree.
const CONTACTS_DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
});
const CONTACTS_NUM_FMT = new Intl.NumberFormat("en-US");

export default function ContactsPage() {
  const [items, setItems] = useState<Contacts[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Contacts | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formStatus, setFormStatus] = useState("lead");
  const [formRevenue, setFormRevenue] = useState("");

  async function load() {
    try {
      const rows = await getRows<Contacts>("contacts", { orderBy: "created_at" });
      setItems(rows.length > 0 ? rows : SAMPLE);
    } catch {
      setItems(SAMPLE);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (editItem) {
      await updateRow("contacts", editItem.id, { name: formName, email: formEmail, status: formStatus, revenue: Number(formRevenue) });
    } else {
      await insertRow("contacts", { name: formName, email: formEmail, status: formStatus, revenue: Number(formRevenue) });
    }
    setDialogOpen(false);
    setEditItem(null);
    setFormName(""); setFormEmail(""); setFormStatus("lead"); setFormRevenue("");
    load();
  }

  async function handleDelete(id: string) {
    await deleteRow("contacts", id);
    load();
  }

  function openEdit(item: Contacts) {
    setEditItem(item);
    setFormName(item.name);
    setFormEmail(item.email);
    setFormStatus(item.status);
    setFormRevenue(String(item.revenue));
    setDialogOpen(true);
  }

  if (loading) return <LoadingState />;

  const filtered = items.filter((i) =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { title: "Total Contacts", value: String(items.length), icon: Users },
    { title: "Active", value: String(items.filter((i) => i.status === "active").length) },
    { title: "Leads", value: String(items.filter((i) => i.status === "lead").length) },
    { title: "Revenue", value: "$" + CONTACTS_NUM_FMT.format(items.reduce((s, i) => s + Number(i.revenue), 0)) }
  ];

  const columns: Column<Contacts>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => <span className="font-medium text-white/80">{row.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      render: (row) => <span className="text-white/60">{row.email}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "revenue",
      header: "Revenue",
      render: (row) => (
        <span className="text-white/80">
          ${CONTACTS_NUM_FMT.format(Number(row.revenue))}
        </span>
      ),
    },
    {
      key: "last_contacted",
      header: "Last Contacted",
      render: (row) => (
        <span className="text-white/40">
          {row.last_contacted ? CONTACTS_DATE_FMT.format(new Date(row.last_contacted)) : "—"}
        </span>
      ),
    },
    {
      key: "id",
      header: "Actions",
      align: "right" as const,
      render: (row) => (
        <div className="space-x-1">
          <Button variant="ghost" size="icon-xs" onClick={() => openEdit(row)}>
            <Pencil className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(row.id)}>
            <Trash2 className="size-3.5 text-red-400" />
          </Button>
        </div>
      ),
    }
  ];

  return (
    <PageShell>
      <PageHeader
        title="Contacts"
        description="Manage your contacts and leads."
        action={
          <GradientButton icon={Plus} onClick={() => setDialogOpen(true)}>
            Create
          </GradientButton>
        }
      />

      <StatsGrid stats={stats} />

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search contacts..."
        containerClassName="mb-4"
      />

      {filtered.length > 0 ? (
        <DataTable columns={columns} data={filtered} />
      ) : (
        <EmptyState
          icon={Users}
          title="No contacts found"
          description={search ? "Try a different search term." : "Create your first contacts to get started."}
          action={
            !search ? (
              <GradientButton icon={Plus} onClick={() => setDialogOpen(true)}>
                Create Contacts
              </GradientButton>
            ) : undefined
          }
        />
      )}

      <FormDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) { setEditItem(null); setFormName(""); setFormEmail(""); setFormStatus("lead"); setFormRevenue(""); }
        }}
        title={editItem ? "Edit Contacts" : "Create Contacts"}
        onSubmit={handleSave}
      >
        <FormField label="Name">
          <ThemedInput
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="John Doe"
          />
        </FormField>
        <FormField label="Email">
          <ThemedInput
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="john@example.com"
          />
        </FormField>
        <FormField label="Status">
          <Select value={formStatus} onValueChange={(v) => setFormStatus(v ?? "")}>
            <SelectTrigger className="border-white/[0.06] bg-brand-surface-input text-white">
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Revenue">
          <ThemedInput
            type="number"
            value={formRevenue}
            onChange={(e) => setFormRevenue(e.target.value)}
            placeholder="0.00"
          />
        </FormField>
      </FormDialog>
    </PageShell>
  );
}
