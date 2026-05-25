import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-5xl font-bold mb-10">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <Link
          href="/admin/projects"
          className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-semibold">
            Manage Projects
          </h2>

          <p className="text-gray-500 mt-3">
            View, edit and manage all projects
          </p>
        </Link>

        <Link
          href="/admin/projects/add"
          className="bg-black text-white p-8 rounded-2xl shadow-md hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-semibold">
            Add Project
          </h2>

          <p className="text-gray-300 mt-3">
            Create a new real estate project
          </p>
        </Link>

      </div>
    </main>
  );
}