import { useEffect, useState } from "react";
import type { IMilestone } from "../../@types/Milestone";
import MilestoneCard from "../../components/features/milestones/MilestoneCard";
import UpsertMilestoneModal from "../../components/features/milestones/UpsertMilestoneModal";
import { useMilestones } from "../../hooks/useMilestones";

export default function MilestonesPage() {
  const { milestones, loading, error, fetchMilestones } = useMilestones();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMilestone, setSelectedMilestone] = useState<IMilestone | null>(
    null
  );

  function onSaveMilestoneSuccess() {
    setIsModalOpen(false);
    setSelectedMilestone(null);
    fetchMilestones();
  }

  function onEditMilestone(milestone: IMilestone) {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
  }

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
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

      <UpsertMilestoneModal
        isOpen={isModalOpen}
        selectedMilestone={selectedMilestone}
        onSuccess={onSaveMilestoneSuccess}
        setIsOpen={setIsModalOpen}
        setSelectedMilestone={setSelectedMilestone}
      />

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
        {milestones.map((m, index) => (
          <MilestoneCard
            id={m.id}
            key={index}
            title={m.title}
            dueDate={m.dueDate}
            status={m.status}
            onEditMilestone={onEditMilestone}
          />
        ))}
      </div>
    </div>
  );
}
