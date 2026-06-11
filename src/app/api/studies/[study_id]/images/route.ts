import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { getServerApiUrl } from "@/lib/shared/config/env";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ study_id: string }> },
) {
  const { study_id } = await context.params;
  const session = await getServerSession(authOptions);
  const formData = await req.formData();

  console.log("study_id:", study_id);
  console.log("token:", session?.accessToken ? "exists" : "MISSING");
  console.log("API URL:", `${getServerApiUrl()}/studies/${study_id}/images`);

  const res = await fetch(`${getServerApiUrl()}/studies/${study_id}/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session?.accessToken ?? ""}` },
    body: formData,
  });

  console.log("backend status:", res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.log("backend error:", errorText);
    return NextResponse.json({ error: errorText }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
