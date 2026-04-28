'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRows } from "@/lib/supabase/db";

interface Trigger {
  id: string;
  name: string;
  event: string;
  created_at: string;
}

export default function TriggersPage() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTriggers() {
      try {
        // Adjust column names to match your Supabase schema
        const data = await getRows("triggers", {
          select: "id, name, event, created_at",
          order: { column: "created_at", ascending: false },
        });
        if (data) {
          setTriggers(data as Trigger[]);
        } else {
          setTriggers([]);
        }
      } catch {
        setTriggers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTriggers();
  }, []);

  return (
    <Card className="border-white/[0.06] bg-brand-surface-light text-white">
      <CardHeader>
        <CardTitle>Triggers</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : triggers.length === 0 ? (
          <p>No triggers found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {triggers.map((trigger) => (
                <TableRow key={trigger.id}>
                  <TableCell>{trigger.name}</TableCell>
                  <TableCell>{trigger.event}</TableCell>
                  <TableCell>{new Date(trigger.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}