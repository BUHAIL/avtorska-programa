"use client";

import { type FormEvent, useEffect, useState } from "react";

type PaymentPlan = "full" | "per_session";

const paymentPlans: Record<PaymentPlan, { title: string; detail: string; total: string }> = {
  full: { title: "Повна оплата", detail: "30$ за зустріч", total: "360$" },
  per_session: { title: "Кожна зустріч окремо", detail: "40$ за зустріч", total: "480$" },
};

const topics = [
  { title: "Як саме я прийшов до вигорання", text: "Не лише «що зі мною не так», а який спосіб життя, роботи та взаємодії з собою привів мене до цього стану. Дослідимо власні джерела навантаження, повторювані сценарії та моменти, коли ми систематично ігноруємо власні потреби." },
  { title: "Когнітивне перевантаження і виснаження", text: "Чому постійна кількість інформації, перемикання уваги, багатозадачність і нескінченні рішення забирають більше ресурсу, ніж ми усвідомлюємо. І як відрізнити звичайну втому від стану, коли ресурс систематично не встигає відновлюватися." },
  { title: "«Я ще можу»", text: "Чому навіть виснажена людина часто продовжує працювати на максимумі. Дослідимо внутрішні правила: «Я повинна впоратися», «Не можна підвести інших», «Спочатку все зроблю — потім відпочину»." },
  { title: "Відпочинок, який не відновлює", text: "Чому вихідні, відпустка або зміна діяльності не завжди повертають енергію. Вчитимемося помічати, що саме потрібно нашій психіці для відновлення і що заважає нам по-справжньому зупинятися." },
  { title: "Межі та постійна доступність", text: "Повідомлення, робочі чати, дзвінки, очікування рідних і відчуття, що потрібно бути доступним завжди. Дослідимо, чому так складно сказати «ні», делегувати або не брати ще одне завдання." },
  { title: "Емоційне виснаження", text: "Дратівливість, байдужість, відстороненість, втрата радості та відчуття «мені вже нічого не хочеться» — будемо розбиратися, що стоїть за цими станами." },
  { title: "Хто я, якщо я не продуктивний?", text: "Дозволити собі бути цінним не лише тоді, коли ти щось робиш. Дослідимо зв’язок між самооцінкою, досягненнями, контролем і постійною потребою бути ефективним." },
  { title: "Нова модель життя після виснаження", text: "Фінальна мета — не навчитися ще краще витримувати навантаження, а зрозуміти, що саме потрібно змінити, щоб повернутися до життя, у якому є не лише результат, але й я сам." },
];

const audience = [
  "постійно відчуває втому, навіть після відпочинку",
  "прокидається вже без відчуття відновлення",
  "живе у режимі «ще трохи — і стане легше»",
  "має труднощі з концентрацією та прийняттям рішень",
  "став більш дратівливим, виснаженим або байдужим",
  "втрачає інтерес до роботи й речей, які раніше радували",
  "відчуває провину за те, що зробив недостатньо",
  "не може дозволити собі зупинитися",
  "звик бути сильним і тим, на кого завжди можна покластися",
  "хоче залишатися ефективним, не доводячи себе до виснаження",
];

const methods = [
  "групова терапевтична робота",
  "дослідження власних сценаріїв і переконань",
  "робота з емоціями",
  "практики усвідомлення власного стану",
  "аналіз щоденних ситуацій",
  "робота з межами та навантаженням",
  "практичні експерименти між зустрічами",
  "підтримка та зворотний зв’язок від групи",
];

function JoinButton({ onClick, light = false }: { onClick: () => void; light?: boolean }) {
  return <button className={"join-button" + (light ? " join-button--light" : "")} onClick={onClick}>Доєднатись <span className="text-arrow" aria-hidden="true">→</span></button>;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"options" | "form" | "success">("options");
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", company: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const openApplication = (plan?: PaymentPlan) => {
    setSelectedPlan(plan ?? null);
    setModalStep(plan ? "form" : "options");
    setFormError("");
    setOpen(true);
  };

  const choosePlan = (plan: PaymentPlan) => {
    setSelectedPlan(plan);
    setModalStep("form");
    setFormError("");
  };

  const submitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPlan) return;
    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, paymentPlan: selectedPlan }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Не вдалося надіслати анкету");
      setModalStep("success");
      setForm({ fullName: "", phone: "", email: "", company: "" });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Не вдалося надіслати анкету. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <main>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <nav className="nav shell" aria-label="Головна навігація">
        <a className="brand" href="#top" aria-label="На початок сторінки"><span className="brand-k">К</span><span>іра Сиротенко</span></a>
        <a className="nav-link" href="#format">Формат</a>
        <button className="nav-cta" onClick={() => openApplication()}>Доєднатись</button>
      </nav>

      <section className="hero shell" id="top">
        <div className="eyebrow"><span /> Терапевтична група • онлайн</div>
        <h1>Вигорання<br /><em>в епоху</em><br />когнітивного<br />перевантаження</h1>
        <div className="hero-bottom">
          <p className="lede">Простір, де не потрібно бути сильним. Три місяці, щоб дослідити виснаження й поступово повернути собі енергію, увагу та відчуття власного життя.</p>
          <JoinButton onClick={() => openApplication()} light />
        </div>
        <div className="facts" aria-label="Коротко про програму"><span>03 <small>місяці</small></span><span>15 <small>учасників</small></span><span>12 <small>зустрічей</small></span></div>
        <div className="photo-frame photo-frame--hero-mobile"><img className="site-photo site-photo--hero site-photo--hero-mobile" src="/images/kira-hero.jpg" width="1023" height="1537" alt="Кіра Сиротенко в білому костюмі" fetchPriority="high" decoding="async" /></div>
      </section>

      <section className="intro shell section">
        <div className="intro-layout">
          <div className="intro-copy">
            <p className="kicker">Коли «нормально» — це постійно втомлено</p>
            <h2>Втома стала майже нормальною частиною життя.</h2>
            <div className="copy">
              <p>Постійні повідомлення, інформаційний шум, багатозадачність, десятки рішень щодня, висока відповідальність і необхідність залишатися доступними майже цілодобово створюють навантаження, до якого наша психіка не встигає адаптуватися.</p>
              <p>Ми продовжуємо працювати, зустрічатися, вирішувати питання, піклуватися про інших — навіть тоді, коли внутрішніх ресурсів уже майже не залишилося.</p>
            </div>
          </div>
          <div className="photo-frame photo-frame--intro"><img className="site-photo site-photo--intro" src="/images/kira-hero.jpg" width="1023" height="1537" alt="Кіра Сиротенко в білому костюмі" loading="lazy" decoding="async" /></div>
        </div>
        <blockquote>Вигорання починається значно раніше — коли відпочинок перестає відновлювати, звичні речі більше не приносять задоволення, а життя поступово перетворюється на постійне «треба».</blockquote>
      </section>

      <section className="shell section" id="for-whom">
        <div className="section-head"><span className="index">01</span><div><h2>Для кого ця група</h2></div></div>
        <div className="audience-list">{audience.map((item, i) => <div className="audience-item" key={item}><span>{String(i + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div>
        <p className="kicker audience-kicker">Впізнаєте себе?</p>
        <JoinButton onClick={() => openApplication()} />
      </section>

      <section className="shell section" id="topics">
        <div className="section-head"><span className="index">02</span><div><h2>Що будемо досліджувати</h2></div></div>
        <div className="topics-grid">{topics.map((topic, i) => <article className="topic-card" key={topic.title}><span className="topic-number">{String(i + 1).padStart(2, "0")}</span><h3>{topic.title}</h3><p>{topic.text}</p></article>)}</div>
        <div className="photo-frame photo-frame--topics"><img className="site-photo site-photo--topics" src="/images/kira-topics.jpg" width="694" height="1122" alt="Кіра Сиротенко" loading="lazy" decoding="async" /></div>
      </section>

      <section className="shell section" id="process">
        <div className="section-head"><span className="index">03</span><div><h2>Як проходитиме курс</h2></div></div>
        <div className="process-copy"><p>Це не лекційний курс про вигорання.</p><p>Це терапевтична група, у якій важливі особистий досвід, безпечна взаємодія та поступова робота з власними патернами.</p></div>
        <div className="methods">{methods.map((method) => <div className="method" key={method}><span>✦</span>{method}</div>)}</div>
        <JoinButton onClick={() => openApplication()} />
      </section>

      <section className="shell section" id="format">
        <div className="format-card">
          <div><p className="kicker">Формат</p><h2>Достатньо простору для кожного</h2><p>Невелика група дозволить кожному учаснику мати простір для власної роботи та водночас отримати важливий досвід взаємодії з людьми, які проходять через схожі труднощі.</p></div>
          <div className="format-stats"><div><strong>15</strong><span>учасників</span></div><div><strong>3</strong><span>місяці</span></div><div><strong>12</strong><span>онлайн-зустрічей</span></div></div>
        </div>
        <p className="manifesto">Вихід із вигорання — це не про те, як навчитися витримувати більше. Це про те, як перестати жити так, ніби витримувати — ваша головна функція.</p>
      </section>

      <section className="shell section host" id="host">
        <div className="section-head"><span className="index">04</span><div><p className="kicker">Авторка та ведуча програми</p><h2>Кіра Сиротенко</h2></div></div>
        <div className="host-grid"><div className="photo-frame photo-frame--author"><img className="site-photo site-photo--author" src="/images/kira-author.jpg" width="1086" height="1448" alt="Кіра Сиротенко, авторка та ведуча програми" loading="lazy" decoding="async" /></div><div className="host-copy">
          <p className="host-role">Психологиня та консультантка з питань психологічного здоров’я, CEO з понад 15-річним досвідом управління.</p>
          <p>Працює з керівниками, підприємцями та людьми з високим рівнем відповідальності, які живуть і працюють в умовах постійного навантаження.</p>
          <p>Поєднує психологічну практику з власним багаторічним досвідом управління та допомагає людям краще розуміти себе, відновлювати внутрішній ресурс і знаходити спосіб жити та працювати без постійного виснаження.</p>
          <JoinButton onClick={() => openApplication()} />
        </div></div>
      </section>

      <section className="shell section pricing" id="pricing">
        <p className="kicker">Варіанти участі</p><h2>Оберіть комфортний формат оплати</h2>
        <div className="price-grid">
          <article className="price-card price-card--featured"><div className="price-label">Вигідніше</div><p>Повна оплата</p><h3><s>40$</s> 30$ <small>/ зустріч</small></h3><strong>360$ — 12 зустрічей</strong><button onClick={() => openApplication("full")}>Обрати повну оплату <span className="text-arrow">→</span></button></article>
          <article className="price-card"><p>Оплата кожної зустрічі</p><h3>40$ <small>/ зустріч</small></h3><strong>480$ — 12 зустрічей</strong><button onClick={() => openApplication("per_session")}>Обрати оплату частинами <span className="text-arrow">→</span></button></article>
        </div>
      </section>

      <footer className="shell footer">
        <p className="footer-title">Поверніть собі місце<br />у власному житті.</p>
        <button onClick={() => openApplication()}>Доєднатись до групи <span className="text-arrow">→</span></button>
        <div className="social-links" aria-label="Соціальні мережі Кіри Сиротенко">
          <a href="https://www.instagram.com/kira_sirotenko?igsh=MWd6Nm1tZ2VseDRkeg%3D%3D&utm_source=qr" target="_blank" rel="noreferrer">Instagram <span>→</span></a>
          <a href="https://www.facebook.com/share/1HrWYfdw8Y/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook <span>→</span></a>
          <a href="https://youtube.com/channel/UCjQqgngEU4IrSQLSkMWUbrg?si=l_PWF8I4aHLqFRxc" target="_blank" rel="noreferrer">YouTube <span>→</span></a>
        </div>
        <div className="footer-bottom"><span>© 2026 Кіра Сиротенко</span><a href="#top">На початок ↑</a></div>
      </footer>

      {open && <div className="modal-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setOpen(false)} aria-label="Закрити">×</button>
          {modalStep === "options" && <>
            <p className="kicker" id="modal-title">Варіанти участі</p>
            <div className="modal-options">
              <button onClick={() => choosePlan("full")}><span><b>Повна оплата</b><small><s>40$</s> 30$ за зустріч</small></span><strong>360$</strong></button>
              <button onClick={() => choosePlan("per_session")}><span><b>Кожна зустріч окремо</b><small>40$ за зустріч</small></span><strong>480$</strong></button>
            </div>
          </>}

          {modalStep === "form" && selectedPlan && <>
            <button className="modal-back" type="button" onClick={() => setModalStep("options")}>← Назад</button>
            <p className="kicker" id="modal-title">Анкета учасника</p>
            <div className="selected-plan"><span><b>{paymentPlans[selectedPlan].title}</b><small>{paymentPlans[selectedPlan].detail}</small></span><strong>{paymentPlans[selectedPlan].total}</strong></div>
            <form className="application-form" onSubmit={submitApplication}>
              <label>ПІБ<input name="fullName" autoComplete="name" required maxLength={120} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Ваше ім’я та прізвище" /></label>
              <label>Номер телефону<input name="phone" type="tel" autoComplete="tel" required maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+380…" /></label>
              <label>Email<input name="email" type="email" autoComplete="email" required maxLength={160} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" /></label>
              <label className="honeypot" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label>
              <p className="form-note">Надсилаючи анкету, ви погоджуєтеся на використання контактів лише для зв’язку щодо участі в курсі.</p>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <button className="submit-application" type="submit" disabled={isSubmitting}>{isSubmitting ? "Надсилаємо…" : "Надіслати анкету"}<span className="text-arrow">→</span></button>
            </form>
          </>}

          {modalStep === "success" && <div className="application-success">
            <span aria-hidden="true">✓</span>
            <p className="kicker" id="modal-title">Анкету надіслано</p>
            <h2>Дякуємо!</h2>
            <p>Ми отримали ваші контакти та незабаром зв’яжемося з вами.</p>
            <button onClick={() => setOpen(false)}>Закрити</button>
          </div>}
        </section>
      </div>}
    </main>
  );
}
