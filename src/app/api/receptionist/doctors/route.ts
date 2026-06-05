import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/shared/api/server-client";

type DoctorListItem = {
  user_id: number;
  first_name: string;
  last_name: string;
  username: string;
};

export async function GET() {
  try {
    const res = await serverFetch<{
      success: boolean;
      data: DoctorListItem[];
    }>("/users?status=active&role=Doctor&limit=100");
    return NextResponse.json(res.data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
