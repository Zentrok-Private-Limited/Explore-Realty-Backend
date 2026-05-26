"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
}: {
  id: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        `/api/projects/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete project");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500"
    >
      Delete
    </button>
  );
}