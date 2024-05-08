import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    
}

export async function POST(req:NextRequest) {
    try{
        const session = await getAuthSession();

        if(!session?.user){
            return new Response("unauthorished",{status:403})
        }

        const body = await req.json()
        const {userId,itemId}=body

        const newWishlist = await db.watchList.create({
            data:{
                userId,
                itemId
            }
        })

        return NextResponse.json(newWishlist)

    }catch(error:any){
        return new Response("something went wrong",{status:500})
    }
}