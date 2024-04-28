import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Item } from "@/types/item";
import { NextRequest, NextResponse } from "next/server";
//import { title } from "process";

//implement sort functionality
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const userAddress = params.get("user");
    const search = params.get("search");
    const category = params.get("category");
    const sort = params.get("sort");

    const item = await db.item.findMany({
      where: {
        listed: true,
        OR: [
          {
            ownerId: userAddress || "",
          },
          {
            title: {
              startsWith: search || "",
            },
          },
          {
            description: {
              contains: search || "",
            },
          },
          { category: category || "" },
        ],
      },
    });
    return NextResponse.json(item,{
        headers:{
            "content-type": "application/json;charset=UTF-8"
        }
    })
  } catch (err:any) {
    console.log(err)
    return new Response("Something went wrong",{status:500})
  }
}

export async function Post(req:Request){
    try{
        //auth check
        const session= await getAuthSession();
        if(!session?.user){
            return new Response("unauthorized",{status:401})
        }

        const body=await req.json()
        const item = body as Omit<Item,"id"|"createdAt"|"updatedAt"> //omitting-ignoring these

        const newItem=await db.item.create({
            data:{
                title:item.title,
                description:item.description,
                price:item.price,
                ownerId:session.user.id,
                image:item.image,
                totalSupply:item.totalSupply,
                availableSupply:item.availableSupply,
                category:item.category  

            }
        })

        return NextResponse.json(newItem)
    }
    catch(error:any){
      console.log(error.message)
      return new Response("something went wrong")
    }
}
