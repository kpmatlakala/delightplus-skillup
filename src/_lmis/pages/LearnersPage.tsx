import LmisLayout from "@/_lmis/components/LmisLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useEffect, useMemo, useState } from "react";

interface EnrolledLearner {
  id: string;
  learner_code: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  progress: number;
}

export default function LearnersPage() {
  const [learners, setLearners] = useState<EnrolledLearner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledLearners = async () => {
      setLoading(true);
      setError(null);

      const rpc = supabase as unknown as {
        rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: EnrolledLearner[] | null; error: { message: string } | null }>;
      };

      const { data, error: fetchError } = await rpc.rpc("dsa_enrolled_learners");

      if (fetchError) {
        setError(fetchError.message);
        setLearners([]);
        setLoading(false);
        return;
      }

      const enrolledLearners = (data ?? []).sort((a, b) => a.full_name.localeCompare(b.full_name));
      setLearners(enrolledLearners);
      setLoading(false);
    };

    fetchEnrolledLearners();
  }, []);

  const subtitle = useMemo(() => {
    if (loading) return "Loading enrolled learners...";
    return `${learners.length} Enrolled Learners`;
  }, [learners.length, loading]);

  return (
    <LmisLayout title="Learners" subtitle={subtitle}>
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm px-4 py-3 mb-4">
          Unable to load enrolled learners: {error}
        </div>
      )}

      {!loading && !error && learners.length === 0 && (
        <div className="rounded-lg border border-border bg-card text-muted-foreground text-sm px-4 py-3 mb-4">
          No active enrollments found yet.
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Loading enrolled learners...
                </TableCell>
              </TableRow>
            )}

            {learners.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{l.learner_code}</TableCell>
                <TableCell className="font-medium">{l.full_name}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{l.email}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{l.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                    {l.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={l.progress} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground w-8">{l.progress}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </LmisLayout>
  );
}
