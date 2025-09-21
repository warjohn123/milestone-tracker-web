import { useCallback, useState } from "react";
import type { IMilestone } from "../@types/Milestone";
import { fetchMilestonesApi, upsertMilestoneApi } from "../api/milestones";

export function useMilestones() {
  const [milestones, setMilestones] = useState<IMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMilestonesApi();
      setMilestones(data ?? []); // safe fallback
    } catch (err) {
      setError((err as Error).message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const upsertMilestone = useCallback(async (milestone: IMilestone) => {
    try {
      const saved = await upsertMilestoneApi(milestone);

      setMilestones((prev) => {
        if (milestone.id) {
          return prev.map((m) => (m.id === saved.id ? saved : m));
        } else {
          return [...prev, saved];
        }
      });

      return saved;
    } catch (err) {
      setError((err as Error).message || "An unknown error occurred");
      throw err;
    }
  }, []);

  return { milestones, loading, error, fetchMilestones, upsertMilestone };
}
