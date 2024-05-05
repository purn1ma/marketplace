import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Rating } from "@/types/rating";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const itemId = params.get("itemId");
    //const authorId = params.get("authorId")
    let ratings;
    if (itemId) {
      ratings = await db.rating.findMany({
        where: {
          itemId: itemId,
        },
      });
      return NextResponse.json(ratings);
    } else {
      return new Response("item not provided", { status: 400 });
    }
  } catch (error: any) {
    console.log(error.message);
    return new Response("something went wrong", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { itemId, authorId, stars, comment } = body as Omit<
      Rating,
      "id" | "createdAt" | "updatedAt"
    >;

    const ratings = await db.rating.create({
      data: {
        itemId,
        authorId,
        stars,
        comment,
      },
    });
    return NextResponse.json(ratings);
  } catch (error: any) {
    console.log(error.message);
    return new Response("something went wrong", { status: 500 });
  }
}
