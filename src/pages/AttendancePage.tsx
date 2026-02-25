import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModuleOption {
  id: string;
  title: string;
  day_label: string | null;
}

interface LearnerRecord {
  id: string;
  learner_code: string;
  full_name: string;
  status: string;
}

interface EnrollmentRow {
  learner: LearnerRecord | null;
}

interface AttendanceRecord {
  learner_id: string;
  present: boolean;
  check_in_at: string | null;
  check_out_at: string | null;
}

const toLocalInputDate = () => {
  const date = new Date();
  const timezoneOffsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
};

const formatDateTime = (value: string | null) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

export default function AttendancePage() {
  const { user } = useAuth();
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [sessionDate, setSessionDate] = useState<string>(toLocalInputDate());
  const [learners, setLearners] = useState<LearnerRecord[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyLearnerId, setBusyLearnerId] = useState<string | null>(null);

  const rpc = supabase as unknown as {
    rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: any; error: { message: string } | null }>;
  };

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      setError(null);

      const modulesResponse = await rpc.rpc("cet_modules");

      if (modulesResponse.error) {
        setError(modulesResponse.error.message);
        setLoading(false);
        return;
      }

      const moduleRows = modulesResponse.data ?? [];
      setModules(moduleRows);
      if (moduleRows.length > 0) {
        setSelectedModule(moduleRows[0].id);
      }

      const enrollmentResponse = await rpc.rpc("cet_enrolled_learners");

      if (enrollmentResponse.error) {
        setError(enrollmentResponse.error.message);
        setLoading(false);
        return;
      }

      setLearners(
        ((enrollmentResponse.data as LearnerRecord[]) ?? []).sort((a, b) => a.full_name.localeCompare(b.full_name))
      );
      setLoading(false);
    };

    loadInitial();
  }, []);

  const ensureSession = async () => {
    if (!selectedModule) return null;

    const created = await rpc.rpc("cet_get_or_create_attendance_session", {
      p_module_id: selectedModule,
      p_session_date: sessionDate,
      p_created_by: user?.id ?? null,
      p_session_label: `Session ${sessionDate}`,
    });

    if (created.error) {
      setError(created.error.message);
      return null;
    }

    setSessionId(created.data ?? null);
    return created.data ?? null;
  };

  useEffect(() => {
    const loadAttendance = async () => {
      setAttendanceMap({});
      setSessionId(null);

      if (!selectedModule) return;

      const existing = await rpc.rpc("cet_get_or_create_attendance_session", {
        p_module_id: selectedModule,
        p_session_date: sessionDate,
        p_created_by: user?.id ?? null,
        p_session_label: `Session ${sessionDate}`,
      });

      if (existing.error) {
        setError(existing.error.message);
        return;
      }

      const existingSessionId = (existing.data as string | null) ?? null;
      setSessionId(existingSessionId);

      if (!existingSessionId) return;

      const records = await rpc.rpc("cet_get_attendance_records", { p_session_id: existingSessionId });

      if (records.error) {
        setError(records.error.message);
        return;
      }

      const nextMap: Record<string, AttendanceRecord> = {};
      for (const record of ((records.data as AttendanceRecord[]) ?? [])) {
        nextMap[record.learner_id] = record;
      }
      setAttendanceMap(nextMap);
    };

    loadAttendance();
  }, [selectedModule, sessionDate, user?.id]);

  const checkIn = async (learnerId: string) => {
    setBusyLearnerId(learnerId);
    setError(null);

    const effectiveSessionId = sessionId ?? (await ensureSession());
    if (!effectiveSessionId) {
      setBusyLearnerId(null);
      return;
    }

    const now = new Date().toISOString();
    const result = await rpc.rpc("cet_check_in", {
      p_session_id: effectiveSessionId,
      p_learner_id: learnerId,
      p_marked_by: user?.id ?? null,
    });

    if (result.error) {
      setError(result.error.message);
      setBusyLearnerId(null);
      return;
    }

    setAttendanceMap((prev) => ({
      ...prev,
      [learnerId]: {
        learner_id: learnerId,
        present: true,
        check_in_at: now,
        check_out_at: prev[learnerId]?.check_out_at ?? null,
      },
    }));
    setBusyLearnerId(null);
  };

  const checkOut = async (learnerId: string) => {
    if (!sessionId) return;
    setBusyLearnerId(learnerId);
    setError(null);

    const now = new Date().toISOString();
    const result = await rpc.rpc("cet_check_out", {
      p_session_id: sessionId,
      p_learner_id: learnerId,
      p_marked_by: user?.id ?? null,
    });

    if (result.error) {
      setError(result.error.message);
      setBusyLearnerId(null);
      return;
    }

    setAttendanceMap((prev) => ({
      ...prev,
      [learnerId]: {
        learner_id: learnerId,
        present: true,
        check_in_at: prev[learnerId]?.check_in_at ?? now,
        check_out_at: now,
      },
    }));
    setBusyLearnerId(null);
  };

  const presentCount = useMemo(() => {
    return Object.values(attendanceMap).filter((record) => record.present).length;
  }, [attendanceMap]);

  const subtitle = loading
    ? "Loading attendance..."
    : `Track learner attendance per session • Present: ${presentCount}/${learners.length}`;

  return (
    <AppLayout title="Attendance" subtitle={subtitle}>
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm px-4 py-3 mb-4">
          Attendance error: {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <label className="text-sm font-medium text-foreground">Session:</label>
        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="px-3 py-1.5 text-sm rounded-md border border-input bg-background"
          disabled={loading || modules.length === 0}
        >
          {modules.length === 0 && <option value="">No modules available</option>}
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.day_label ? `${m.day_label} — ` : ""}
              {m.title}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={sessionDate}
          onChange={(event) => setSessionDate(event.target.value)}
          className="px-3 py-1.5 text-sm rounded-md border border-input bg-background"
          disabled={loading}
        />

        <Badge variant="outline">{sessionId ? "Session Ready" : "Session Not Started"}</Badge>

        <span className="text-sm text-muted-foreground ml-auto">
          Present: {presentCount}/{learners.length}
        </span>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead className="w-24 text-center">Status</TableHead>
              <TableHead className="w-56 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Loading attendance data...
                </TableCell>
              </TableRow>
            )}

            {!loading && learners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No enrolled learners found.
                </TableCell>
              </TableRow>
            )}

            {learners.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{l.learner_code}</TableCell>
                <TableCell className="font-medium">{l.full_name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(attendanceMap[l.id]?.check_in_at ?? null)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(attendanceMap[l.id]?.check_out_at ?? null)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={attendanceMap[l.id]?.present ? "text-success border-success/30 bg-success/10" : ""}>
                    {attendanceMap[l.id]?.present ? "Present" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => checkIn(l.id)}
                      disabled={busyLearnerId === l.id || !!attendanceMap[l.id]?.check_in_at}
                    >
                      Check In
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => checkOut(l.id)}
                      disabled={
                        busyLearnerId === l.id ||
                        !attendanceMap[l.id]?.check_in_at ||
                        !!attendanceMap[l.id]?.check_out_at
                      }
                    >
                      Check Out
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
