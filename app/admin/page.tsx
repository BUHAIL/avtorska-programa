"use client";

import { useEffect, useState } from "react";

type ApplicationRecord = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  payment_plan: "full" | "per_session";
  created_at: string;
};

function planLabel(plan: string) {
  return plan === "full" ? "Повна оплата — 360$" : "Кожна зустріч — 480$";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Kyiv",
  }).format(new Date(`${value.replace(" ", "T")}Z`));
}

export default function AdminPage() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "unauthorized" | "forbidden" | "error">("loading");

  useEffect(() => {
    fetch("/api/admin/applications", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) return setStatus("unauthorized");
        if (response.status === 403) return setStatus("forbidden");
        if (!response.ok) throw new Error("Request failed");
        const data = (await response.json()) as { applications: ApplicationRecord[] };
        setApplications(data.applications);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") {
    return <main className="admin-page admin-message"><p className="kicker">Завантаження</p><h1>Відкриваємо заявки…</h1></main>;
  }

  if (status === "unauthorized") {
    return <main className="admin-page admin-message"><p className="kicker">Закритий розділ</p><h1>Увійдіть, щоб переглянути заявки.</h1><a href="/signin-with-chatgpt?return_to=%2Fadmin" target="_top">Увійти через ChatGPT</a></main>;
  }

  if (status === "forbidden") {
    return <main className="admin-page admin-message"><p className="kicker">Закритий розділ</p><h1>У цього акаунта немає доступу.</h1><a href="/signout-with-chatgpt?return_to=%2Fadmin">Увійти іншим акаунтом</a></main>;
  }

  if (status === "error") {
    return <main className="admin-page admin-message"><p className="kicker">Помилка</p><h1>Не вдалося завантажити заявки.</h1><button onClick={() => window.location.reload()}>Спробувати ще раз</button></main>;
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div><p className="kicker">Адміністрування</p><h1>Заявки на курс</h1></div>
        <nav><a href="/">На сайт</a><a href="/signout-with-chatgpt?return_to=%2F">Вийти</a></nav>
      </header>
      <p className="admin-count">Усього заявок: <strong>{applications.length}</strong></p>
      {applications.length === 0 ? (
        <div className="admin-empty">Поки що заявок немає.</div>
      ) : (
        <div className="applications-table-wrap">
          <table className="applications-table">
            <thead><tr><th>Дата</th><th>ПІБ</th><th>Телефон</th><th>Email</th><th>Формат</th></tr></thead>
            <tbody>{applications.map((application) => (
              <tr key={application.id}>
                <td>{formatDate(application.created_at)}</td>
                <td>{application.full_name}</td>
                <td><a href={`tel:${application.phone}`}>{application.phone}</a></td>
                <td><a href={`mailto:${application.email}`}>{application.email}</a></td>
                <td><span className={`plan-tag plan-tag--${application.payment_plan}`}>{planLabel(application.payment_plan)}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </main>
  );
}
