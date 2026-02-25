import AppLayout from "@/components/AppLayout";
import { learners } from "@/data/courseData";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function LearnersPage() {
  return (
    <AppLayout title="Learners" subtitle={`${learners.length} CET Lecturers Enrolled`}>
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
            {learners.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{l.id}</TableCell>
                <TableCell className="font-medium">{l.name}</TableCell>
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
    </AppLayout>
  );
}
