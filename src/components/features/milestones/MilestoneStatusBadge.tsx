import type { MilestoneStatus } from "../../../enums/MilestoneStatus";

export default function MilestoneStatusBadge({
  status,
}: {
  status: MilestoneStatus;
}) {
  const statusClasses: Record<MilestoneStatus, string> = {
    Pending: "bg-gray-100 text-gray-700",
    Completed: "bg-green-100 text-green-700",
    Overdue: "bg-red-100 text-red-700",
  };

  return (
    <div
      className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${statusClasses[status]}`}
    >
      {status}
    </div>
  );
}
