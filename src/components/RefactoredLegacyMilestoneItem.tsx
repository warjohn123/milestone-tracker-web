// RefactoredLegacyMilestoneItem.tsx

type MilestoneStatus = "Pending" | "Completed" | "Overdue";

interface Props {
  id: string;
  title: string;
  dueDate: string;
  status: MilestoneStatus;
  onUpdateStatus: (status: MilestoneStatus) => void;
  onEdit: (id: string) => void;
}

const cardStyle: React.CSSProperties = {
  // Removed inline styles for readability and created a style object
  border: "1px solid gray",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px", // optional, just to make it cleaner
};

export default function RefactoredLegacyMilestoneItem(
  {
    id,
    status,
    title,
    dueDate,
    onEdit,
    onUpdateStatus,
  }: Props /* added Props type */
) {
  const toggleStatus = () => {
    // simplified toggleStatus function
    onUpdateStatus(status === "Pending" ? "Completed" : "Pending");
  };

  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <p>Due: {dueDate}</p>
      <p>Status: {status}</p>
      <button onClick={toggleStatus}>Toggle Status</button>
      <button onClick={() => onEdit(id)}>Edit</button>
    </div>
  );
}
