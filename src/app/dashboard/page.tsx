"use client";

import { useEffect, useState } from "react";
import { getRows } from "@/lib/supabase/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TABLE_PREFIX = process.env.NEXT_PUBLIC_TABLE_PREFIX || "followiqs_";
const TABLE_0 = `${TABLE_PREFIX}follow_up_flows`;
const TABLE_1 = `${TABLE_PREFIX}quotes`;

type Row = Record<string, unknown>;

export default function DashboardHomePage() {
  const [loading, setLoading] = useState(true);
  const [count0, setCount0] = useState<number>(0);
  const [count1, setCount1] = useState<number>(0);
  const [recentRows, setRecentRows] = useState<Row[]>([]);

  useEffect(() => {
    getRows<Row>(TABLE_0, { limit: 1000 }).then(r => setCount0(r.length)).catch(() => {});
    getRows<Row>(TABLE_1, { limit: 1000 }).then(r => setCount1(r.length)).catch(() => {});
    getRows<Row>(TABLE_0, { orderBy: "created_at", ascending: false, limit: 5 })
      .then(setRecentRows)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allEmpty = !loading && count0 === 0 && count1 === 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Welcome to Followiqs</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <Card className="border-white/[0.06] bg-brand-surface-light text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-white/50 uppercase tracking-wider">Follow Up Flows</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{loading ? "\u2014" : count0}</p>
          </CardContent>
        </Card>
        <Card className="border-white/[0.06] bg-brand-surface-light text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-white/50 uppercase tracking-wider">Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{loading ? "\u2014" : count1}</p>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started (shown when all tables empty) */}
      {allEmpty && (
        <Card className="border-white/[0.06] bg-brand-surface-light text-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white/60">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/50 mb-4">Your dashboard is ready. Here are some steps to get started:</p>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: "var(--brand-primary)", color: "white" }}>1</span>
                <span className="text-sm text-white/70">Add your first follow up flows records</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ background: "var(--brand-primary)", color: "white" }}>2</span>
                <span className="text-sm text-white/70">Add your first quotes records</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {!allEmpty && (
        <Card className="border-white/[0.06] bg-brand-surface-light text-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white/60">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-8 text-white/40">Loading...</div>
            ) : recentRows.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-white/40">No recent activity.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06]">
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Steps Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRows.map((row, i) => (
                    <TableRow key={String(row.id ?? i)} className="border-white/[0.06] hover:bg-white/[0.02]">
                <TableCell>{String(row.name ?? "")}</TableCell>
                <TableCell>{String(row.status ?? "")}</TableCell>
                <TableCell>{String(row.steps_count ?? "")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-medium text-white/60 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/dashboard/flows" className="block">
            <Card className="border-white/[0.06] bg-brand-surface-light text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-white">Flows</p>
                <p className="text-xs text-white/40 mt-1">Manage flows</p>
              </CardContent>
            </Card>
          </a>
          <a href="/dashboard/flows/[id]" className="block">
            <Card className="border-white/[0.06] bg-brand-surface-light text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-white">Flows [Id]</p>
                <p className="text-xs text-white/40 mt-1">Manage flows [id]</p>
              </CardContent>
            </Card>
          </a>
          <a href="/dashboard/runs" className="block">
            <Card className="border-white/[0.06] bg-brand-surface-light text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-white">Runs</p>
                <p className="text-xs text-white/40 mt-1">Manage runs</p>
              </CardContent>
            </Card>
          </a>
          <a href="/dashboard/triggers" className="block">
            <Card className="border-white/[0.06] bg-brand-surface-light text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-white">Triggers</p>
                <p className="text-xs text-white/40 mt-1">Manage triggers</p>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
}
