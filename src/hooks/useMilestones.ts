import { useCallback, useState } from "react";
import type { IMilestone } from "../@types/Milestone";

export function useMilestones() {
  const [milestones, setMilestones] = useState<IMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/milestones`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      console.log("data", data);
      setMilestones(data);
    } catch (err: { message: string } | unknown) {
      setError(
        (err as { message: string }).message || "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  async function upsertMilestone(milestone: IMilestone) {
    const isUpdate = !!milestone.id;
    const url = isUpdate
      ? `${import.meta.env.VITE_API_URL}/milestones/${milestone.id}`
      : `${import.meta.env.VITE_API_URL}/milestones`;
    const method = isUpdate ? "PUT" : "POST";

    console.log("milestone", milestone);

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(milestone),
    });

    if (!res.ok)
      throw new Error(`Failed to ${isUpdate ? "update" : "create"} milestone`);

    const saved = await res.json();

    console.log("saved", saved);

    // update local state
    setMilestones((prev) => {
      if (isUpdate) {
        return prev.map((m) => (m.id === saved.id ? saved : m));
      } else {
        return [...prev, saved];
      }
    });

    return saved;
  }

  return { milestones, loading, error, fetchMilestones, upsertMilestone };
}
