'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRows } from "@/lib/supabase/db";

interface Flow {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export default function FlowsPage() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFlows() {
      try {
        // Adjust column names to match your Supabase schema
        const data = await getRows("flows", {
          select: "id, name, description, created_at",
          order: { column: "created_at", ascending: false },
        });
        if (data) {
          setFlows(data as Flow[]);
        } else {
          setFlows([]);
        }
      } catch {
        setFlows([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFlows();
  }, []);

  return (
    <Card className="border-white/[0.06] bg-brand-surface-light text-white">
      <CardHeader>
        <CardTitle>Flows</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : flows.length === 0 ? (
          <p>No flows found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flows.map((flow) => (
                <TableRow key={flow.id}>
                  <TableCell>{flow.name}</TableCell>
                  <TableCell>{flow.description ?? "-"}</TableCell>
                  <TableCell>{new Date(flow.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}