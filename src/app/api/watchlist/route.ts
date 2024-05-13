import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { parseArgs } from "util";

export async function GET(req: NextRequest) {
  try{
    const session = await getAuthSession();
    if(!session?.user){
      return new Response("user unauthorized",{status:403})
    }

    // const params = req.nextUrl.searchParams;
    // const userId =  params.get("userId");
    // const itemId = params.get("itemId");

    const user = await db.user.findFirst({
      where:{
        id : session.user.id
      },
      include:{
        watchList:true 
      }
    })
    return NextResponse.json(user?.watchList)
  }
  catch(error:any){
    console.log(error.message)
    return new Response("something went wrong", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("unauthorished", { status: 403 });
    }

    const body = await req.json();
    const { userId, itemId } = body;

    const newWishlist = await db.watchList.create({
      data: {
        userId,
        itemId,
      },
    });

    return NextResponse.json(newWishlist);
  } catch (error: any) {
    console.log(error.message)
    return new Response("something went wrong", { status: 500 });
  }
}

export async function DELETE(req:NextRequest) {
  try{
    const session= await getAuthSession();

    if(!session?.user){
      return new Response("user unauthorised",{status:403})
    }

    const itemId = req.nextUrl.searchParams.get("itemId")

    await db.watchList.delete({
      where:{
        userId_itemId: {
          userId: session.user.id,
          itemId: itemId || ""
        }
      }
    })

    return new Response("Item Deleted", { status: 200 })
  } 
  catch(error: any) {
    console.log(error.message)
    return new Response("something went wrong", { status: 500 });
  }
}