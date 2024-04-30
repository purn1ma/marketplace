import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { Purchase } from "@/types/purchase";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const buyerAddress = params.get("buyer");
    const sellerAddress = params.get("seller");

    const purchases = await db.purchase.findMany({
      where: {
        OR: [
          {
            buyerId: buyerAddress || "",
          },
          {
            sellerId: sellerAddress || "",
          },
        ],
      },
    });
    return NextResponse.json(purchases, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return new Response("something went wrong", { status: 500 });
  }
}

export async function POST(req:NextRequest) {
    try{
        const session=await getAuthSession()

        if(!session?.user){
            return new Response("unauthorised",{status:401})
        }

        const body= await req.json()
        const purchase = body as Omit<Purchase,"id"|"createdAt" | "updatedAt">

        const newPurchase = await db.purchase.create({
            data:{
                itemId:purchase.itemId,
                buyerId:purchase.buyerId,
                sellerId:purchase.sellerId,
                status:purchase.status,
                txnDigest:purchase.txnDigest
            }
        })
        return NextResponse.json(newPurchase)
    }
    catch(error:any){
        console.log(error.message)
        return new Response("something went wrong",{status:500})
    }
    
}
