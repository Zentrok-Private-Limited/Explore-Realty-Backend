import ProjectForm from "@/components/ProjectForm";

async function getProject(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/${id}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function EditPage({
  params,
}: any) {
  const project = await getProject(params.id);

  return (
    <div className="p-10">
      <ProjectForm initialData={project} />
    </div>
  );
}