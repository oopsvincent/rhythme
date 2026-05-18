import { NextResponse } from "next/server";

const ML_ENDPOINT = process.env.ML_ENDPOINT;
const API_SECRET = process.env.API_SECRET || "";
const ML_WARMUP_TIMEOUT_MS = Number(process.env.ML_WARMUP_TIMEOUT_MS || "90000");

export async function GET() {
  if (!ML_ENDPOINT) {
    return NextResponse.json(
      { status: "error", reason: "missing_endpoint" },
      { status: 503 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ML_WARMUP_TIMEOUT_MS);

  try {
    const response = await fetch(`${ML_ENDPOINT}/v1/health`, {
      method: "GET",
      headers: {
        "x-api-secret": API_SECRET,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (response.ok) {
      return NextResponse.json({ status: "ready" }, { status: 200 });
    }

    if ([408, 425, 429, 502, 503, 504].includes(response.status)) {
      return NextResponse.json(
        { status: "waking", reason: `upstream_${response.status}` },
        { status: 202 }
      );
    }

    return NextResponse.json(
      { status: "error", reason: `upstream_${response.status}` },
      { status: 503 }
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json(
        { status: "waking", reason: "timeout" },
        { status: 202 }
      );
    }

    return NextResponse.json(
      { status: "error", reason: "request_failed" },
      { status: 503 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
