import { PlusCircle } from "lucide-react"; // optional icon library

export default function EmptyListPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-6">
        <PlusCircle className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        No milestones yet
      </h2>
      <p className="text-gray-500 mb-6">
        Start by creating your first milestone to track progress.
      </p>
    </div>
  );
}
