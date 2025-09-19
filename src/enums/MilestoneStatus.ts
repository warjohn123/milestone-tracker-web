const MilestoneStatus = {
  Pending: "Pending",
  Completed: "Completed",
}

// infer type as "Pending" | "Completed"
export type MilestoneStatus = typeof MilestoneStatus[keyof typeof MilestoneStatus];