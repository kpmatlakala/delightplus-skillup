/**
 * useModuleFlow
 *
 * Loads the structured lesson-flow for a module unit standard from Supabase.
 * On first load it immediately returns the bundled static data (no flicker),
 * then upgrades to the DB record once it arrives — ensuring admin and learner
 * always see identical content from the same authoritative source.
 *
 * Seed flow: admins can call `upsertFlow(id, flow)` (or use the bulk seeder)
 * to push/update content in the DB.  Until a row exists for a module, the hook
 * transparently falls back to the static TS data.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  type ModuleLessonFlow,
  moduleLessonFlows,
} from "@/data/moduleLessonFlows";

// ── internal helpers ────────────────────────────────────────────────────────

function isValidFlow(value: unknown): value is ModuleLessonFlow {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v["moduleId"] === "string" && Array.isArray(v["lessons"]);
}

// ── hook ────────────────────────────────────────────────────────────────────

export type FlowSource = "static" | "db";

export interface UseModuleFlowResult {
  /** The resolved flow — DB record when available, static fallback otherwise */
  flow: ModuleLessonFlow | undefined;
  /** Where the current data came from */
  source: FlowSource;
  loading: boolean;
  /** Push a flow to the DB (admin / lecturer only) */
  upsertFlow: (moduleId: string, data: ModuleLessonFlow) => Promise<{ error: string | null }>;
  /** Seed ALL modules from the bundled static file into the DB */
  seedAllFlows: () => Promise<{ seeded: number; errors: string[] }>;
}

export function useModuleFlow(moduleId: string | undefined): UseModuleFlowResult {
  // Seed static data as immediate value so the page never flickers empty
  const [flow, setFlow] = useState<ModuleLessonFlow | undefined>(
    moduleId ? moduleLessonFlows[moduleId] : undefined
  );
  const [source, setSource] = useState<FlowSource>("static");
  const [loading, setLoading] = useState(false);
  const loadedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!moduleId) {
      setFlow(undefined);
      setSource("static");
      loadedFor.current = null;
      return;
    }

    // Reset to static when module changes
    const staticFlow = moduleLessonFlows[moduleId];
    setFlow(staticFlow);
    setSource("static");

    if (loadedFor.current === moduleId) return;
    loadedFor.current = moduleId;

    setLoading(true);
    (supabase as any)
      .rpc("cet_get_module_flow", { p_unit_std_id: moduleId })
      .then(({ data, error }: { data: unknown; error: { message: string } | null }) => {
        setLoading(false);
        if (error || data === null || data === undefined) return; // keep static
        if (isValidFlow(data)) {
          setFlow(data);
          setSource("db");
        }
      });
  }, [moduleId]);

  // ── upsert a single flow (admin action) ──────────────────────────────────
  const upsertFlow = useCallback(
    async (
      id: string,
      data: ModuleLessonFlow
    ): Promise<{ error: string | null }> => {
      const { error } = await (supabase as any).rpc("cet_upsert_module_flow", {
        p_unit_std_id: id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        p_flow: data as any,
      });
      if (error) return { error: error.message };

      // If this is the currently loaded module, upgrade the local state
      if (id === moduleId) {
        setFlow(data);
        setSource("db");
      }
      // Reset cache so next navigation re-fetches
      loadedFor.current = null;
      return { error: null };
    },
    [moduleId]
  );

  // ── bulk seeder: push every static flow to the DB ─────────────────────────
  const seedAllFlows = useCallback(async (): Promise<{
    seeded: number;
    errors: string[];
  }> => {
    const entries = Object.entries(moduleLessonFlows);
    let seeded = 0;
    const errors: string[] = [];

    for (const [id, flowData] of entries) {
      const { error } = await (supabase as any).rpc("cet_upsert_module_flow", {
        p_unit_std_id: id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        p_flow: flowData as any,
      });
      if (error) {
        errors.push(`${id}: ${error.message}`);
      } else {
        seeded++;
      }
    }

    // If current module was re-seeded, reset so it re-fetches on next effect run
    loadedFor.current = null;
    return { seeded, errors };
  }, []);

  return { flow, source, loading, upsertFlow, seedAllFlows };
}
