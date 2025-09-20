import { useState } from "react";
import type { IMilestone } from "../../@types/Milestone";
import MilestoneCard from "../../components/features/milestones/MilestoneCard";
import UpsertMilestoneModal from "../../components/features/milestones/UpsertMilestoneModal";

export default function MilestonesPage() {
  const milestones: IMilestone[] = [
    {
      id: "1",
      title: "Launch Website",
      dueDate: "2023-10-15",
      status: "Completed",
    },
    {
      id: "2",
      title: "Eat Pizza",
      dueDate: "2023-10-15",
      status: "Completed",
    },
    {
      id: "3",
      title: "Drink Coke",
      dueDate: "2023-10-15",
      status: "Completed",
    },
    {
      id: "4",
      title: "Drink Coke",
      dueDate: "2023-10-15",
      status: "Completed",
    },
    {
      id: "5",
      title: "Drink Coke",
      dueDate: "2023-10-15",
      status: "Completed",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function handleClose() {
    setIsModalOpen(false);
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-4">Milestones</h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
        >
          + New Milestone
        </button>
      </div>

      <UpsertMilestoneModal handleClose={handleClose} isOpen={isModalOpen} />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
        {milestones.map((m, index) => (
          <MilestoneCard
            id={m.id}
            key={index}
            title={m.title}
            dueDate={m.dueDate}
            status={m.status}
          />
        ))}
      </div>
    </div>
  );
}
