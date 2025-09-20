import { useEffect, useState } from "react";

export interface Milestone {
  id: number;
  title: string;
  dueDate: string;
  status: string;
}

export function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMilestones() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/milestones");
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        if (isMounted) setMilestones(data);
      } catch (err: { message: string } | unknown) {
        if (isMounted) setError((err as { message: string }).message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchMilestones();

    return () => {
      isMounted = false;
    };
  }, []);

  return { milestones, loading, error };
}
