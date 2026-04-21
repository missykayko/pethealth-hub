import { NextResponse } from "next/server";

// This endpoint can be called by a cron job (e.g., Vercel Cron) at midnight
// to signal that daily statuses should reset.
// The actual "reset" is handled client-side by filtering status_logs
// to only show entries from today (after midnight).
// This route exists as a hook point if you want server-side cleanup.

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Status logs are never deleted — the client filters by today's date.
  // This endpoint can be extended to archive old logs, send summaries, etc.
  return NextResponse.json({
    ok: true,
    message: "Daily reset acknowledged",
    timestamp: new Date().toISOString(),
  });
}
