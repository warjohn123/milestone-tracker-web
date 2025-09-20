import type { IMilestone } from "../../../@types/Milestone";

export default function MilestoneCard({ title, dueDate, status }: IMilestone) {
  return (
    <div className="w-full max-w-md rounded-xl shadow-md border border-gray-200 p-4 bg-white flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">Due: {dueDate}</p>
      <span className="px-3 py-1 rounded-full text-sm font-medium w-fit bg-gray-100 text-gray-700">
        {status}
      </span>
    </div>
  );
}
