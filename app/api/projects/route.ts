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

// GET ALL PROJECTS
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
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

    return NextResponse.json(projects, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("FULL ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const project = await prisma.project.create({
      data: {
        slug: body.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
        name: body.name,
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
          create: body.amenities
            .filter((item: string) => item.trim())
            .map((item: string) => ({
              name: item,
            })),
        },

        highlights: {
          create: body.highlights
            .filter((item: string) => item.trim())
            .map((item: string) => ({
              text: item,
            })),
        },

        nearby: {
          create: body.nearby
            .filter((item: string) => item.trim())
            .map((item: string) => ({
              text: item,
            })),
        },

        gallery: {
          create: body.gallery
            .filter((item: string) => item.trim())
            .map((item: string) => ({
              image: item,
            })),
        },

        floorPlans: {
          create: body.floorPlans.filter((item: any) => item.img),
        },

        priceDetails: {
          create: body.priceDetails.filter(
            (item: any) => item.type || item.size || item.price,
          ),
        },

        locationAdvantages: {
          create: body.locationAdvantages.filter(
            (item: any) => item.title || item.value,
          ),
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

    return NextResponse.json(project, {
  headers: corsHeaders,
});
  } catch (error) {
    console.error("FULL ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
