import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEnrolledLearners = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: directError } = await (supabase as unknown as any)
          .from("learners")
          .select("id, learner_code, full_name, email, phone, status, progress")
          .order("full_name", { ascending: true });

        if (!directError && Array.isArray(data)) {
          setLearners(
            data.map((learner: any) => ({
              id: learner.id,
              learner_code: learner.learner_code,
              full_name: learner.full_name || "Learner",
              email: learner.email ?? null,
              phone: learner.phone ?? null,
              status: learner.status || "Active",
              progress: Number(learner.progress ?? 0),
            }))
          );
          setLoading(false);
          return;
        }
      } catch (directReadError) {
        console.warn("Direct learner management read failed, falling back to RPC:", directReadError);
      }

      const rpc = supabase as unknown as {
        rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: EnrolledLearner[] | null; error: { message: string } | null }>;
      };

      const { data, error: fetchError } = await rpc.rpc("cet_enrolled_learners");

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

  const filteredLearners = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return learners;

    return learners.filter((learner) =>
      [learner.full_name, learner.learner_code, learner.email ?? "", learner.phone ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [learners, searchTerm]);

  const subtitle = useMemo(() => {
    if (loading) return "Loading learner management...";
    return `${learners.length} Learners Registered`;
  }, [learners.length, loading]);

  return (
    <AppLayout title="Learners" subtitle={subtitle}>
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

      <div className="rounded-lg border border-border bg-card p-4 mb-4 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Learner Management</p>
            <p className="text-xs text-muted-foreground">Search and review all registered learners before testing.</p>
          </div>
          <div className="w-full md:w-80">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, code, email, or phone..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">Total: {learners.length}</Badge>
          <Badge variant="outline">Showing: {filteredLearners.length}</Badge>
          <Badge variant="outline">Active: {learners.filter((learner) => (learner.status || "").toLowerCase() === "active").length}</Badge>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Learner Code</TableHead>
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

            {filteredLearners.map((l) => (
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

            {!loading && filteredLearners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No learners match your search yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
