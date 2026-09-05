import { listApplications } from "../../../../db/applications";
import { getCloudflareAccessUser } from "../../../cloudflare-access";

const ADMIN_EMAILS = new Set([
  "mishasyroten74@gmail.com",
  "kira.syrotenko@gmail.com",
]);

export async function GET() {
  const user = await getCloudflareAccessUser();

  if (!user) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!ADMIN_EMAILS.has(user.email)) {
    return Response.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const applications = await listApplications();
    return Response.json({ applications });
  } catch (error) {
    console.error("Applications list failed", error);
    return Response.json({ error: "Could not load applications" }, { status: 500 });
  }
}
