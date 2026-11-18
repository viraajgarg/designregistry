import { NextRequest, NextResponse } from "next/server";

const apiBaseUrl = process.env.DESIGN_REGISTRY_API_URL ?? "http://localhost:8000";

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const target = new URL(
    `/${path.map((part) => encodeURIComponent(part)).join("/")}${request.nextUrl.search}`,
    apiBaseUrl,
  );
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      cache: "no-store",
    });
    const responseHeaders = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) responseHeaders.set("content-type", contentType);
    const body =
      response.status === 204 || request.method === "HEAD"
        ? null
        : await response.arrayBuffer();
    return new NextResponse(body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Design Registry API request failed", error);
    return NextResponse.json(
      { detail: "The Design Registry API is unavailable. Check that the API server is running." },
      { status: 502 },
    );
  }
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
};
