import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { IMilestone } from "../../../@types/Milestone";
import { useMilestones } from "../../../hooks/useMilestones";

interface Props {
  isOpen: boolean;
  selectedMilestone: IMilestone | null;
  setIsOpen: (val: boolean) => void;
  onSuccess: () => void;
  setSelectedMilestone: (milestone: IMilestone | null) => void;
}

const MilestoneSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  dueDate: Yup.date().required("Due date is required"),
});

export default function UpsertMilestoneModal({
  isOpen,
  selectedMilestone,
  onSuccess,
  setIsOpen,
  setSelectedMilestone,
}: Props) {
  const { upsertMilestone } = useMilestones();
  if (!isOpen) return null;

  async function onSubmit(values: { title: string; dueDate: string }) {
    await upsertMilestone({
      id: selectedMilestone?.id,
      title: values.title,
      dueDate: values.dueDate,
      status: selectedMilestone ? selectedMilestone.status : "Pending",
    });

    onSuccess();
  }

  function handleClose() {
    setIsOpen(false);
    setSelectedMilestone(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedMilestone ? "Edit Milestone" : "Create Milestone"}
        </h2>

        <Formik
          initialValues={{
            title: selectedMilestone?.title || "",
            dueDate: selectedMilestone?.dueDate || "",
          }}
          validationSchema={MilestoneSchema}
          onSubmit={(values, { resetForm }) => {
            onSubmit(values);
            resetForm();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Title field */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="title"
                >
                  Title
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter milestone title"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Due Date field */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="dueDate"
                >
                  Due Date
                </label>
                <Field
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <ErrorMessage
                  name="dueDate"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
