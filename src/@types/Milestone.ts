import type { MilestoneStatus } from "../enums/MilestoneStatus";

export interface IMilestone {
  id: number;
  title: string;
  dueDate: string;
  status: MilestoneStatus;
}
