export type ApplicationRecord = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  payment_plan: "full" | "per_session";
  created_at: string;
};

async function getBinding() {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) {
    throw new Error("База заявок тимчасово недоступна.");
  }
  return env.DB;
}

export async function createApplication(input: {
  fullName: string;
  phone: string;
  email: string;
  paymentPlan: "full" | "per_session";
}) {
  const id = crypto.randomUUID();
  const database = await getBinding();
  await database
    .prepare(
      `INSERT INTO applications (id, full_name, phone, email, payment_plan)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(id, input.fullName, input.phone, input.email, input.paymentPlan)
    .run();
  return id;
}

export async function listApplications(): Promise<ApplicationRecord[]> {
  const database = await getBinding();
  const result = await database
    .prepare(
      `SELECT id, full_name, phone, email, payment_plan, created_at
       FROM applications
       ORDER BY created_at DESC`,
    )
    .all<ApplicationRecord>();
  return result.results;
}
