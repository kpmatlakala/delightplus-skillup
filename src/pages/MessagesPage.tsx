import AppLayout from "@/components/AppLayout";
import { Mail } from "lucide-react";

export default function MessagesPage() {
  return (
    <AppLayout title="Messages" subtitle="Direct messages between facilitators and coordinators">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-secondary mb-4">
          <Mail size={32} className="text-muted-foreground" />
        </div>
        <h3 className="font-display font-semibold text-foreground mb-1">No messages yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Direct messaging will be available once the platform is connected to a backend. For now, use WhatsApp for urgent communication.
        </p>
      </div>
    </AppLayout>
  );
}
