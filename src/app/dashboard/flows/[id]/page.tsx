"use client";

import { useState } from "react";
import { insertRow, updateRow, deleteRow } from "@/lib/supabase/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Check, Trash2, Loader2 } from "lucide-react";

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "followiqs_";
const TABLE_NAME = `${TABLE_PREFIX}flows`;

export default function FlowDetailsPage() {
  const [form, setForm] = useState<Record<string, string>>({ name: '', description: '', status: '', trigger_type: '', automation_steps: '', is_active: '' });
  const [recordId, setRecordId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!recordId) return;
    setDeleting(true);
    try {
      await deleteRow(TABLE_NAME, recordId);
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (recordId) {
        await updateRow(TABLE_NAME, recordId, form);
      } else {
        const created = await insertRow(TABLE_NAME, form);
        if (created && typeof created === "object" && "id" in created) {
          setRecordId(String((created as Record<string, unknown>).id));
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-white">Flow Details</h1>

      <Card className="border-white/[0.06] bg-brand-surface-light text-white">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-white/60">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white/60">Flow Name</Label>
          <Input
            name="name"
            value={String(form.name ?? "")}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} 
            placeholder="Flow Name"
            className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/30"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white/60">Description</Label>
          <Textarea
            name="description"
            value={String(form.description ?? "")}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
            placeholder="Description"
            className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/30"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white/60">Status</Label>
          <Select
            value={String(form.status ?? "")}
            onValueChange={(v) => setForm(p => ({ ...p, status: v }))}>
            <SelectTrigger className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/30">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">(none)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white/60">Trigger Type</Label>
          <Select
            value={String(form.trigger_type ?? "")}
            onValueChange={(v) => setForm(p => ({ ...p, trigger_type: v }))}>
            <SelectTrigger className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/30">
              <SelectValue placeholder="Select Trigger Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">(none)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white/60">Number of Steps</Label>
          <Input
            name="automation_steps"
            value={String(form.automation_steps ?? "")}
            onChange={e => setForm(p => ({ ...p, automation_steps: e.target.value }))} 
            placeholder="Number of Steps"
            className="border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/30"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-white/60">Active</Label>
          <div className="flex items-center gap-2">
            <Switch
              checked={Boolean(form.is_active)}
              onCheckedChange={(checked) => setForm(p => ({ ...p, is_active: checked }))} />
            <span className="text-sm text-white/60">{Boolean(form.is_active) ? "Yes" : "No"}</span>
          </div>
        </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white">
                {saving ? <><Loader2 className="mr-2 size-4 animate-spin" />Saving...</> : recordId ? "Update" : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setDeleteOpen(true)}
                className="border-red-600/30 text-red-400 hover:bg-red-600/10">
                <Trash2 className="mr-2 size-4" />
                Delete
              </Button>
              {saved && <span className="flex items-center gap-1 text-sm text-green-400"><Check className="size-4" />Saved!</span>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-white/[0.06] bg-brand-surface text-white">
          <DialogHeader>
            <DialogTitle>Delete Flow Details</DialogTitle>
            <DialogDescription className="text-white/50">
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <p className="py-4 text-white/80">Are you sure you want to delete this record?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}
              className="border-white/[0.06] text-white hover:bg-white/[0.06]">Cancel</Button>
            <Button onClick={handleDelete} disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white">
              {deleting ? <><Loader2 className="mr-2 size-4 animate-spin" />Deleting...</> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
