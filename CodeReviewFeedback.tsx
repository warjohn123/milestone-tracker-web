// ProjectList.tsx
import React, { useEffect, useState } from "react";
/**
 *
 * We could remove `React` import here since we're already destructuring `useEffect` and `useState` from it.
 */

function ProjectList() {
  const [projects, setProjects] = useState<any[]>([]);
  /**
   * Replace `any` with an appropriate and specific type for clarity e.g. `IProject[]` if you have such an interface defined.
   * Define the interface as
   * interface IProject {
   *   id: string;
   *   name: string;
   *   // add other fields when necessary...
   * }
   */
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      /**
       * I would use a custom hook here to encapsulate the fetching logic and state management.
       * This would make the component cleaner and more reusable.
       * Consider something like useProjects hook.
       * Example:
       * const { projects, loading, error, fetchProjects } = useProjects();
       */
      setLoading(true);
      const res = await fetch("https://api.example.com/projects");
      const data = await res.json();
      setProjects(data);
      setLoading(false);
    }
    /**
     * 1. We could add error handling here to manage fetch failures gracefully. Consider try catch block and finally for setting loading to false.
     * 2. The API URL should ideally come from a configuration file or environment variable to prevent hardcoding and improve maintainability.
     * 3. Change setProjects(data) to setProjects(data ?? []) to ensure projects is always an array, preventing potential runtime errors.
     */

    fetchProjects();
  }, []);

  return (
    <div>
      {loading && <p>Loading projects...</p>}
      <ul>
        {projects.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectList;
