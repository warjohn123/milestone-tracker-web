import type { IMilestone } from "../../../@types/Milestone";
import { Pencil } from "lucide-react";

export default function MilestoneCard({
  id,
  title,
  dueDate,
  status,
  onEditMilestone,
}: IMilestone & {
  onEditMilestone: (milestone: IMilestone) => void;
}) {
  return (
    <div className="w-full max-w-md rounded-xl shadow-md border border-gray-200 p-4 bg-white flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          type="button"
          className="p-1 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-gray-100 transition cursor-pointer"
          aria-label="Edit milestone"
          onClick={() => onEditMilestone({ id, title, dueDate, status })}
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>
      <p className="text-sm text-gray-500">Due: {dueDate}</p>
      <span className="px-3 py-1 rounded-full text-sm font-medium w-fit bg-gray-100 text-gray-700">
        {status}
      </span>
    </div>
  );
}
