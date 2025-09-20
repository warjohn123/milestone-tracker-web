const MilestoneStatus = {
  Pending: "Pending",
  Completed: "Completed",
  Overdue: "Overdue",
};

export type MilestoneStatus =
  (typeof MilestoneStatus)[keyof typeof MilestoneStatus];
