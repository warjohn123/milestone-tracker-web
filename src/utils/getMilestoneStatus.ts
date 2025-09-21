import type { MilestoneStatus } from "../enums/MilestoneStatus";

export const computeMilestoneStatus = (
  status: MilestoneStatus,
  dueDate: string
): MilestoneStatus => {
  const now = new Date();
  const due = new Date(dueDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  let effectiveStatus: MilestoneStatus = status;
  if (status === "Pending" && dueDay < today) {
    effectiveStatus = "Overdue";
  }

  return effectiveStatus;
};
