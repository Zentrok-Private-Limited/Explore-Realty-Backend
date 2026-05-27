import ProjectForm from "@/components/ProjectForm";

async function getProject(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/projects/${slug}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function EditPage({
  params,
}: any) {
  const project = await getProject(params.slug);

  return (
    <div className="p-10">
      <ProjectForm initialData={project} />
    </div>
  );
}