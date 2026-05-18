import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { patientId, referralNote, ashaId } = await req.json();
    const abhaId = `ABHA-${Date.now()}`;
    // In production, integrate with ABDM Sandbox APIs
    console.log(`Referral sent. ABHA: ${abhaId}, Note: ${referralNote}`);
    return NextResponse.json({ success: true, abhaId, status: "PENDING_ACCEPTANCE" });
}