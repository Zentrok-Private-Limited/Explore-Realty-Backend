async function getProjects() {
  const res = await fetch(
    "http://localhost:3000/api/projects",
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-10">
        Projects
      </h1>

      <div className="grid gap-5">
        {projects.map((project: any) => (
          <div
            key={project.id}
            className="border p-5 rounded-xl"
          >
            <h2 className="text-xl font-semibold">
              {project.name}
            </h2>

            <p>{project.location}</p>

            <p>{project.price}</p>

            <a
              href={`/admin/projects/edit/${project.id}`}
              className="text-blue-500"
            >
              Edit
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}