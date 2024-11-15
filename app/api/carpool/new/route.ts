import { createCarpoolAction } from "@/app/carpool/carpool.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const carpool = await createCarpoolAction(data);

  if(!carpool) {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true });
}
