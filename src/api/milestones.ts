import type { IMilestone } from "../@types/Milestone";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchMilestonesApi(): Promise<IMilestone[]> {
  const res = await fetch(`${API_URL}/milestones`);
  if (!res.ok) throw new Error(`Failed to fetch milestones: ${res.status}`);
  return res.json();
}

export async function upsertMilestoneApi(
  milestone: IMilestone
): Promise<IMilestone> {
  const isUpdate = !!milestone.id;
  const url = isUpdate
    ? `${API_URL}/milestones/${milestone.id}`
    : `${API_URL}/milestones`;
  const method = isUpdate ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(milestone),
  });

  if (!res.ok) {
    throw new Error(`Failed to ${isUpdate ? "update" : "create"} milestone`);
  }

  return res.json();
}
