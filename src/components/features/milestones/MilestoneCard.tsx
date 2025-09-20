import type { IMilestone } from "../../../@types/Milestone";
import { Pencil, CheckCircle, Circle } from "lucide-react";
import type { MilestoneStatus } from "../../../enums/MilestoneStatus";
import MilestoneStatusBadge from "./MilestoneStatusBadge";

export default function MilestoneCard({
  id,
  title,
  dueDate,
  status,
  onEditMilestone,
  onToggleStatus,
}: IMilestone & {
  onEditMilestone: (milestone: IMilestone) => void;
  onToggleStatus: (id: string, newStatus: MilestoneStatus) => void;
}) {
  const isCompleted = status === "Completed";

  const now = new Date();
  const due = new Date(dueDate);

  const milestoneStatus = (): MilestoneStatus => {
    let effectiveStatus: MilestoneStatus = status;
    if (status === "Pending" && due < now) {
      effectiveStatus = "Overdue";
    }

    return effectiveStatus;
  };

  return (
    <div className="w-full max-w-md rounded-xl shadow-md border border-gray-200 p-4 bg-white flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1 rounded-full text-gray-500 hover:text-green-600 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Toggle milestone status"
            onClick={() =>
              onToggleStatus(id!, isCompleted ? "Pending" : "Completed")
            }
          >
            {isCompleted ? (
              <Circle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
          </button>
          <button
            type="button"
            className="p-1 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Edit milestone"
            onClick={() => onEditMilestone({ id, title, dueDate, status })}
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500">Due: {dueDate}</p>

      <MilestoneStatusBadge status={milestoneStatus()} />
    </div>
  );
}
