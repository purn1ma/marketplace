import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{purchaseId:string}}) {
    try{
        const purchaseId = params.purchaseId
        const purchase = await db.purchase.findUnique({
            where:{
                id:purchaseId
            }
        })

        if(!purchase){
            return new Response("Purchase not found",{status:404})
        }
        return NextResponse.json(purchase)
    }catch(error:any){
        console.log(error.message)
        return new Response("something went wrong",{status:500})
    }
}

export async function PUT(req:NextRequest,{params}:{params:{purchaseId:string}}) {
    try{
        const purchaseId=params.purchaseId
        const session = await getAuthSession()
        if(!session?.user){
          return new Response("Unauthorised", {status:401})
        }

        const body=await req.json()
        const status=body.status

        if(!status){
            return new Response("status not provided",{status:400})
        }

        const updatedPurchase = await db.purchase.update({
            data:{
                status
            },
            where:{
                id:purchaseId
            }
        })
        return NextResponse.json(updatedPurchase)
        
    }
    catch(error:any){
        console.log(error.message)
        return new Response("something went wrong",{status:500})
    }
}

export async function DELETE(req:NextRequest,{params}:{params:{purchaseId:string}}) {
   try { const purchaseId = params.purchaseId
    const session = await getAuthSession()
    
    if(!session?.user){
        return new Response("user unauthorized",{status:401})
    }

    await db.purchase.delete({
        where:{
            id:purchaseId
        }
    })

    return new Response("deletion successful",{status:200})
   }
   catch(error:any){
    console.log(error.message)
    return new Response("something went wrong",{status:500})
}
}