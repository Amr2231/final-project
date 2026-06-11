import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { getServerApiUrl } from "@/lib/shared/config/env";

// POST /api/studies/[study_id]/images
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ study_id: string }> },
) {
  // get study_id
  const { study_id } = await context.params;
  const session = await getServerSession(authOptions);
  const formData = await req.formData();

  // get images from formData
  const res = await fetch(`${getServerApiUrl()}/studies/${study_id}/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session?.accessToken ?? ""}` },
    body: formData,
  });

  // if error from backend
  if (!res.ok) {
    const errorText = await res.text();
    console.log("backend error:", errorText);
    return NextResponse.json({ error: errorText }, { status: res.status });
  }

  // return response
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
