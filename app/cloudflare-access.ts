import { headers } from "next/headers";

export type CloudflareAccessUser = {
  email: string;
};

const ACCESS_EMAIL_HEADER = "cf-access-authenticated-user-email";

export async function getCloudflareAccessUser(): Promise<CloudflareAccessUser | null> {
  const requestHeaders = await headers();
  const email = requestHeaders.get(ACCESS_EMAIL_HEADER)?.trim().toLowerCase();

  return email ? { email } : null;
}
