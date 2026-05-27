import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// HANDLE OPTIONS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET SINGLE PROJECT
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        builderInfo: true,
        investment: true,
        amenities: true,
        highlights: true,
        gallery: true,
        floorPlans: true,
        priceDetails: true,
        nearby: true,
        locationAdvantages: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project, { headers: corsHeaders });
  } catch (error) {
  console.error("FULL ERROR:", error);

  return NextResponse.json(
    {
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error),
    },
    { status: 500 }
  );
}
}

// UPDATE PROJECT
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    // DELETE OLD RELATIONS
    await prisma.builderInfo.deleteMany({ where: { projectId: id } });
    await prisma.investment.deleteMany({ where: { projectId: id } });
    await prisma.amenity.deleteMany({ where: { projectId: id } });
    await prisma.highlight.deleteMany({ where: { projectId: id } });
    await prisma.gallery.deleteMany({ where: { projectId: id } });
    await prisma.floorPlan.deleteMany({ where: { projectId: id } });
    await prisma.priceDetail.deleteMany({ where: { projectId: id } });
    await prisma.nearby.deleteMany({ where: { projectId: id } });
    await prisma.locationAdvantage.deleteMany({ where: { projectId: id } });

    // UPDATE PROJECT
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
        price: body.price,
        img: body.img,
        type: body.type,
        brochure: body.brochure,
        map: body.map,
        shortDesc: body.shortDesc,
        description: body.description,
        location: body.location,
        config: body.config,
        rera: body.rera,
        developer: body.developer,
        possession: body.possession,
        area: body.area,
        roi: body.roi,
        builderInfo: {
          create: {
            name: body.builderInfo.name,
            experience: body.builderInfo.experience,
          },
        },
        investment: {
          create: {
            rental: body.investment.rental,
            appreciation: body.investment.appreciation,
          },
        },
        amenities: {
          create: body.amenities.map((item: string) => ({
            name: item,
          })),
        },
        highlights: {
          create: body.highlights.map((item: string) => ({
            text: item,
          })),
        },
        gallery: {
          create: body.gallery.map((item: string) => ({
            image: item,
          })),
        },
        nearby: {
          create: body.nearby.map((item: string) => ({
            text: item,
          })),
        },
        floorPlans: {
          create: body.floorPlans,
        },
        priceDetails: {
          create: body.priceDetails,
        },
        locationAdvantages: {
          create: body.locationAdvantages,
        },
      },
      include: {
        builderInfo: true,
        investment: true,
        amenities: true,
        highlights: true,
        gallery: true,
        floorPlans: true,
        priceDetails: true,
        nearby: true,
        locationAdvantages: true,
      },
    });

    return NextResponse.json(updatedProject, { headers: corsHeaders });
  } catch (error) {
  console.error("FULL ERROR:", error);

  return NextResponse.json(
    {
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error),
    },
    { status: 500 }
  );
}
}

// DELETE PROJECT
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: "Project deleted successfully" }, { headers: corsHeaders });
  } catch (error) {
  console.error("FULL ERROR:", error);

  return NextResponse.json(
    {
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error),
    },
    { status: 500 }
  );
}
}