import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req:NextRequest,{params}:{params:{id:string}}) {
    try{
        const id =params.id

        const item = await db.item.findUnique({
            where:{
                id
            }
        })

        if(!item){
            return new Response("item not found",{status:404})
        }

        return NextResponse.json(item)
    }
    catch(error:any){
        console.log(error.message)
        return new Response("something went wrong")
    }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("unauthorised", { status: 401 });
    }

    const body = await req.json();
    const { title, description, totalSupply, availableSupply, price, listed } =
      body;

    const updatedItem = await db.item.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        totalSupply,
        availableSupply,
        price,
        listed,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.log(error.message);
    return new Response("something went wrong");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("unauthorised", { status: 401 });
    }

    await db.item.delete({
      where: {
        id,
      },
    });

    return new Response("item deleted successfully", { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return new Response("something went wrong");
  }
}
