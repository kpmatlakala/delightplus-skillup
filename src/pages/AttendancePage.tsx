import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { modules, learners } from "@/data/courseData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function AttendancePage() {
  const [selectedModule, setSelectedModule] = useState(modules[0].id);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const toggleAttendance = (learnerId: string) => {
    setAttendance((prev) => ({ ...prev, [learnerId]: !prev[learnerId] }));
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <AppLayout title="Attendance" subtitle="Track learner attendance per session">
      {/* Module selector */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <label className="text-sm font-medium text-foreground">Session:</label>
        <select
          value={selectedModule}
          onChange={(e) => { setSelectedModule(e.target.value); setAttendance({}); }}
          className="px-3 py-1.5 text-sm rounded-md border border-input bg-background"
        >
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.days} — {m.title}
            </option>
          ))}
        </select>
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
              <TableHead className="w-24 text-center">Present</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {learners.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{l.id}</TableCell>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={!!attendance[l.id]}
                    onCheckedChange={() => toggleAttendance(l.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
