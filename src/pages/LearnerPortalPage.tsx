import AppLayout from "@/components/AppLayout";
import { modules, program } from "@/data/courseData";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Bell, Clock3, PlayCircle, Lock, ChevronRight, RefreshCw, GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { useAnnouncements } from "@/hooks/useAnnouncements";

export default function LearnerPortalPage() {
  const { progressMap } = useModuleProgress();
  const modulePath = modules;
  const completedModules = modulePath.filter((m) => !!progressMap[m.id]?.guide_completed).length;
  const firstUndoneIndex = modulePath.findIndex((m) => !progressMap[m.id]?.guide_completed);
  const currentModuleIndex = firstUndoneIndex === -1 ? modulePath.length : firstUndoneIndex;
  const overallProgress = Math.round((completedModules / modules.length) * 100);
  const practicalModules = modules.filter((m) => m.type === "Practical").length;
  const knowledgeModules = modules.filter((m) => m.type === "Knowledge").length;
  const unreadMessages = 3;
  const [orientationOpen, setOrientationOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <AppLayout title="Learner Portal" subtitle="Mission-based learning path">
      <div>
        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">Knowledge</p>
            <p className="font-display text-xl font-bold mt-1">{knowledgeModules}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">Practical</p>
            <p className="font-display text-xl font-bold mt-1">{practicalModules}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">Unread</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="font-display text-xl font-bold">{unreadMessages}</p>
              <MessageSquare size={16} className="text-accent" />
            </div>
          </div>
        </div>
        {/* Learning Path section */}
        <div className="rounded-lg border border-border bg-card p-4 mt-4">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-2">
            <PlayCircle size={16} className="text-accent" /> Learning Path
          </h3>
          <p className="text-xs text-muted-foreground mb-3">Select a module to continue your mission path.</p>
          <div className="space-y-2 max-h-[19rem] overflow-auto pr-1">
            <button
              onClick={() => setOrientationOpen(true)}
              className="w-full text-left flex items-start gap-3 rounded-md border-2 border-accent/40 bg-accent/5 px-3 py-3 transition-colors hover:bg-accent/10 group"
            >
              <div className="shrink-0 mt-0.5 h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center">
                <GraduationCap size={14} className="text-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">Welcome to Information Technology: Systems Development</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                    <Sparkles size={9} /> Start Here
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Before you begin your 10-module journey — understand what a system is, what systems development means,
                  and how this qualification connects to your IT career.
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground shadow-sm group-hover:bg-accent/90 transition-colors">
                  Open Programme Orientation →
                </span>
              </div>
            </button>
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Your 10 Modules</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            {modulePath.map((mod, index) => {
              const isCompleted = !!progressMap[mod.id]?.guide_completed;
              const isCurrent = index === currentModuleIndex;
              const isLocked = index > currentModuleIndex && !isCompleted;
              return (
                <Link
                  key={mod.id}
                  to={`/learner/modules/${mod.id}`}
                  className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors ${
                    isCurrent
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary/40"
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-2.5">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="text-[11px] font-bold bg-primary/10 text-primary">
                        {index + 1}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{mod.title}</p>
                        {isCompleted && <Badge variant="outline">Done</Badge>}
                        {isCurrent && <Badge>Current</Badge>}
                        {isLocked && <Badge variant="secondary">Locked</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{mod.code} • Block {mod.block} • {mod.credits} credits</p>
                    </div>
                  </div>
                  {isLocked ? <Lock size={14} className="text-muted-foreground shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
                </Link>
              );
            })}
          </div>
        </div>
        {/* Programme Orientation Modal */}
        <Dialog open={orientationOpen} onOpenChange={setOrientationOpen}>
          <DialogContent className="max-w-3xl w-full p-0 gap-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <GraduationCap size={18} className="text-accent" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold leading-tight">
                    Welcome to Information Technology: Systems Development
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    FETC: IT Systems Development · SAQA 78965 · NQF Level 4
                  </p>
                </div>
              </div>
            </DialogHeader>
            <ScrollArea className="max-h-[65vh]">
              <div className="px-6 py-5 space-y-7 text-sm">
                <section className="rounded-lg border border-border bg-muted/30 p-4 flex items-start gap-4">
                  <div className="shrink-0 h-11 w-11 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                    KM
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm">Kabelo Matlakala — Your Facilitator</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Scrum Master &amp; Systems Development Facilitator · Data Science Academy · Starting March 2026</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      BSc Mathematical Sciences, University of Limpopo. Software Developer background (mLab CodeTribe Academy). Based in Limpopo Province.
                      Kabelo delivers this qualification and is the primary point of contact for learner support across all 3 blocks.
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                      <span className="text-muted-foreground">📧 <a href="mailto:matlakalakabelo1@gmail.com" className="text-accent hover:underline">matlakalakabelo1@gmail.com</a></span>
                      <span className="text-muted-foreground">📱 <a href="tel:+27727138367" className="text-accent hover:underline">+27 72 713 8367</a></span>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
