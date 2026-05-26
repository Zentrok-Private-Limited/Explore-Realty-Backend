import DeleteButton from "@/components/DeleteButton";

async function getProjects() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-10">Projects</h1>

      <div className="grid gap-5">
        {projects.map((project: any) => (
          <div key={project.id} className="border p-5 rounded-xl">
            <h2 className="text-xl font-semibold">{project.name}</h2>

            <p>{project.location}</p>

            <p>{project.price}</p>

            <div className="flex gap-4 mt-3">
              <a
                href={`/admin/projects/edit/${project.id}`}
                className="text-blue-500"
              >
                Edit
              </a>

              <DeleteButton id={project.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
