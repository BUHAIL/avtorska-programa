import { createApplication } from "../../../db/applications";

type ApplicationPayload = {
  fullName?: unknown;
  phone?: unknown;
  email?: unknown;
  paymentPlan?: unknown;
  company?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ApplicationPayload;
    const fullName = clean(payload.fullName, 120);
    const phone = clean(payload.phone, 40);
    const email = clean(payload.email, 160).toLowerCase();
    const company = clean(payload.company, 120);
    const paymentPlan = payload.paymentPlan;

    if (company) {
      return Response.json({ ok: true }, { status: 201 });
    }
    if (fullName.length < 3) {
      return Response.json({ error: "Вкажіть, будь ласка, ваше ПІБ." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length < 7) {
      return Response.json({ error: "Перевірте, будь ласка, номер телефону." }, { status: 400 });
    }
    if (!emailPattern.test(email)) {
      return Response.json({ error: "Перевірте, будь ласка, email." }, { status: 400 });
    }
    if (paymentPlan !== "full" && paymentPlan !== "per_session") {
      return Response.json({ error: "Оберіть формат оплати." }, { status: 400 });
    }

    const id = await createApplication({ fullName, phone, email, paymentPlan });
    return Response.json({ ok: true, id }, { status: 201 });
  } catch (error) {
    console.error("Application submission failed", error);
    return Response.json(
      { error: "Не вдалося надіслати анкету. Спробуйте ще раз трохи пізніше." },
      { status: 500 },
    );
  }
}
