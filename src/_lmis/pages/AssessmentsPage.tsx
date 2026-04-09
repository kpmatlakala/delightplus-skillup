import LmisLayout from "@/_lmis/components/LmisLayout";
import { modules } from "@/data/courseData";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const assessments = modules.map((mod) => ({
  moduleId: mod.id,
  moduleTitle: mod.title,
  moduleCode: mod.code,
  formative: `Activity Workbook — ${mod.activities.length} tasks`,
  summative: mod.type === "Practical" ? "Practical Assessment Task (PAT)" : "Knowledge Test",
  weight: mod.credits,
  status: "Ready",
}));

export default function AssessmentsPage() {
  return (
    <LmisLayout title="Assessments" subtitle="Formative & Summative Assessments per Module">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead className="hidden md:table-cell">Formative</TableHead>
              <TableHead className="hidden md:table-cell">Summative</TableHead>
              <TableHead className="w-20">Credits</TableHead>
              <TableHead className="w-24">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((a) => (
              <TableRow key={a.moduleId}>
                <TableCell>
                  <p className="font-medium">{a.moduleTitle}</p>
                  <p className="text-xs text-muted-foreground">{a.moduleCode}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{a.formative}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{a.summative}</TableCell>
                <TableCell className="font-mono text-sm">{a.weight}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                    {a.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </LmisLayout>
  );
}
