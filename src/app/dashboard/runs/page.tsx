'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRows } from "@/lib/supabase/db";

interface Run {
  id: string;
  flow_name: string;
  status: string;
  started_at: string;
}

export default function RunsPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRuns() {
      try {
        // Adjust column names to match your Supabase schema
        const data = await getRows("runs", {
          select: "id, flow_name, status, started_at",
          order: { column: "started_at", ascending: false },
        });
        if (data) {
          setRuns(data as Run[]);
        } else {
          setRuns([]);
        }
      } catch {
        setRuns([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRuns();
  }, []);

  return (
    <Card className="border-white/[0.06] bg-brand-surface-light text-white">
      <CardHeader>
        <CardTitle>Runs</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : runs.length === 0 ? (
          <p>No runs found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flow Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run.id}>
                  <TableCell>{run.flow_name}</TableCell>
                  <TableCell>{run.status}</TableCell>
                  <TableCell>{new Date(run.started_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}