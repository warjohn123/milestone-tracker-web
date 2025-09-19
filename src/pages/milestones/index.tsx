import type { IMilestone } from "../../@types/Milestone";
import MilestoneCard from "../../components/features/milestones/MilestoneCard";

export default function MilestonesPage() {
    const milestones: IMilestone[] = [
        {
            id: "1",
            title: "Launch Website",
            dueDate: "2023-10-15",
            status: "Completed"
        },
        {
            id: "2",
            title: "Eat Pizza",
            dueDate: "2023-10-15",
            status: "Completed"
        },
        {
            id: "3",
            title: "Drink Coke",
            dueDate: "2023-10-15",
            status: "Completed"
        },
        {
            id: "4",
            title: "Drink Coke",
            dueDate: "2023-10-15",
            status: "Completed"
        },
        {
            id: "5",
            title: "Drink Coke",
            dueDate: "2023-10-15",
            status: "Completed"
        },
        
    ]

    return <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Milestones</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
}