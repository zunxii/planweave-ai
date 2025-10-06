import { NextRequest, NextResponse } from "next/server";
import { generatePlanFromQuery } from "@/services/ai/planner";
import { plannerToReactFlow } from "@/services/flowchart";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "query is required" }, { status: 400 });

    const plan = await generatePlanFromQuery(query);
    const flow = plannerToReactFlow(plan);
    return NextResponse.json({ plan, flow });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { plan, instruction } = await req.json();
    if (!plan || !instruction) return NextResponse.json({ error: 'plan and instruction are required' }, { status: 400 });
    return NextResponse.json({ plan });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'failed' }, { status: 500 });
  }
}