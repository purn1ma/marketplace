import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(req:NextRequest, {params}:{params:{id:string}}) {
    try{
     const id = params.id
     const session = await getAuthSession()

     if(!session?.user){
        return new Response("unauthorised",{status:401})
     }

     const body= await req.json()
     const {title,description,totalSupply,availableSupply,price,listed} = body
     
     const updatedItem = await db.item.update({
        where:{
            id,
        },
        data:{
            title,
            description,
            totalSupply,
            availableSupply,
            price,
            listed,
        }
     })

     return NextResponse.json(updatedItem)
    }catch(error:any){
        console.log(error.message)
        return new Response("something went wrong")
    }
}