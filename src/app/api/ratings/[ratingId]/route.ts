import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Rating } from "@/types/rating";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req:NextRequest,{params:{ratingId}}:{params:{ratingId:string}}){
    try{
        const session = await getAuthSession()
        
        if(!session?.user){
            return new Response("unauthorized",{status:401})
        }

        const body=await req.json()
        const {stars,comment} = body as Omit<Rating , "id"|"createdAt"|"updatedAt"|"authorId"|"itemId">

        const updateRating = await db.rating.update({
            where:{
                id:ratingId
            },
            data:{
                stars,
                comment
            }
        })

        return NextResponse.json(updateRating)

    }catch(error:any){
        console.log(error.message)
        return new Response("something went wrong",{status:500})
    }
}

export async function DELETE(req:NextRequest,{params:{ratingId}}:{params:{ratingId:string}}) {
    try{
        const session=await getAuthSession()

        if(!session?.user){
            return new Response("unauthorized",{status:401})
        }

        await db.rating.delete({
            where:{
                id:ratingId
            }
        })

        return new Response("item deleted successfully",{status:200})
    }
    catch(error:any){
        console.log(error.message)
        return new Response("something went wrong",{status:500})
    }
}