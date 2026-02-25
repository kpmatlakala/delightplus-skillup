import AppLayout from "@/components/AppLayout";
import { useState } from "react";
import { Megaphone, Send } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
}

const initialAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Block 1 Schedule Confirmed",
    message: "Block 1 training begins 02 March 2026 at CET Venda. All 5 modules (Days 1–5) are confirmed. Facilitator guides and learner workbooks will be distributed via USB.",
    date: "2026-02-25",
  },
  {
    id: "2",
    title: "Offline Portal Available",
    message: "The DSA Course Tracker is now available offline. Connect to the local Wi-Fi hotspot and navigate to http://192.168.1.100:3000 to access all materials.",
    date: "2026-02-25",
  },
];

export default function AnnouncementsPage() {
  const [announcements] = useState<Announcement[]>(initialAnnouncements);

  return (
    <AppLayout title="Announcements" subtitle="Important updates for facilitators and learners">
      <div className="space-y-4 max-w-2xl">
        {announcements.map((a) => (
          <div key={a.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0">
                <Megaphone size={16} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-card-foreground">{a.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{a.date}</p>
                <p className="text-sm text-muted-foreground mt-2">{a.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
