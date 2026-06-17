import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Security: prevent path traversal
  const sanitized = slug.replace(/\.\.\//g, "").replace(/\.\.\\/g, "").replace(/\//g, "").replace(/\\/g, "");
  if (sanitized !== slug) {
    return new NextResponse("Invalid game slug", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public/games", slug, "index.html");

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Game not found", { status: 404 });
  }

  const html = fs.readFileSync(filePath, "utf-8");

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // No CSP headers — game runs freely
      "X-Frame-Options": "SAMEORIGIN",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
