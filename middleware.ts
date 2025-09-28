import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/share/(.*)",
  "/waitlist",
  "/api/share/(.*)",
  "/api-docs(.*)",
  "/api/swagger(.*)",
  "/favicon.ico",
  "/_next/(.*)",
  "/public/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api)(.*)"],
};
