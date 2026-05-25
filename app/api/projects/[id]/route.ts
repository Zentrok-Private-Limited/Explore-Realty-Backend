import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET SINGLE PROJECT
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
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

    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Failed to fetch project",
      },
      {
        status: 500,
      },
    );
  }
}

// UPDATE PROJECT
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    // DELETE OLD RELATIONS
    await prisma.builderInfo.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    await prisma.investment.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    await prisma.amenity.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    await prisma.highlight.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    await prisma.gallery.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    await prisma.floorPlan.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    await prisma.priceDetail.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    await prisma.nearby.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    await prisma.locationAdvantage.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    // UPDATE PROJECT
    const updatedProject = await prisma.project.update({
      where: {
        id: params.id,
      },

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

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Failed to update project",
      },
      {
        status: 500,
      },
    );
  }
}

// DELETE PROJECT
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.project.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Failed to delete project",
      },
      {
        status: 500,
      },
    );
  }
}
