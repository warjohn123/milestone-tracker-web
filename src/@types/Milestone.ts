import type { MilestoneStatus } from "../enums/MilestoneStatus";

export interface IMilestone {
  id: string;
  title: string;
  dueDate: string;
  status: MilestoneStatus;
}
