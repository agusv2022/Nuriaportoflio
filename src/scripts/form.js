/**
 * Formulario de contacto.
 * Envía por fetch al endpoint configurado en el CMS (campo
 * "URL del formulario") sin recargar la página, y da parte de
 * lo que pasa en todo momento.
 *
 * Si no hay endpoint configurado, en vez de fallar en silencio
 * avisa y ofrece el correo directo.
 */

/* La dirección se lee del enlace mailto de la página, que sale del CMS.
   Así, si Nuria la cambia, los mensajes de error la siguen. */
function siteEmail() {
  const link = document.querySelector('a[href^="mailto:"]');
  return link ? link.getAttribute("href").replace("mailto:", "").trim() : null;
}

function messages() {
  const mail = siteEmail();
  const fallback = mail ? ` Write to ${mail} instead.` : " Please try again later.";
  const offline = mail ? ` Please write to ${mail}.` : "";
  return {
    empty: "Fill in every field before sending.",
    email: "That email address doesn't look right.",
    sending: "Sending…",
    ok: "Thanks — your message is on its way. I reply within 48 hours.",
    fail: `Something went wrong.${fallback}`,
    network: "No connection. Check your network and try again.",
    offline: `The form isn't connected yet.${offline}`,
  };
}

function capitalise(text) {
  const clean = String(text).trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export function initForm() {
  const form = document.querySelector("[data-form]");
  if (!form) return;

  const MESSAGES = messages();

  const status = form.querySelector("[data-status]");
  const button = form.querySelector("[data-submit]");
  const label = form.querySelector("[data-label]");
  const original = label ? label.textContent : "";
  const endpoint = form.dataset.endpoint;

  const say = (text, state) => {
    if (!status) return;
    status.textContent = text;
    status.dataset.state = state;
  };

  const fields = ["name", "email", "message"].map((id) => form.querySelector(`#${id}`));

  fields.forEach((field) => {
    if (!field) return;
    field.addEventListener("input", () => {
      field.removeAttribute("aria-invalid");
      if (status && status.dataset.state === "error") say("", "");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    /* trampa antispam: si un bot la rellena, fingimos éxito */
    if (form.querySelector('[name="_gotcha"]')?.value) {
      say(MESSAGES.ok, "ok");
      form.reset();
      return;
    }

    const [nameField, emailField, messageField] = fields;
    let firstBad = null;

    fields.forEach((field) => {
      if (field && !field.value.trim()) {
        field.setAttribute("aria-invalid", "true");
        firstBad = firstBad || field;
      }
    });

    if (firstBad) {
      say(MESSAGES.empty, "error");
      firstBad.focus();
      return;
    }

    if (emailField && !isEmail(emailField.value.trim())) {
      emailField.setAttribute("aria-invalid", "true");
      emailField.focus();
      say(MESSAGES.email, "error");
      return;
    }

    if (!endpoint) {
      say(MESSAGES.offline, "error");
      return;
    }

    button?.setAttribute("disabled", "");
    if (label) label.textContent = MESSAGES.sending;
    say(MESSAGES.sending, "sending");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        form.reset();
        say(MESSAGES.ok, "ok");
        return;
      }

      /* Formspree devuelve los errores por campo:
         { errors: [{ field: "email", message: "should be an email" }] }
         Los marcamos uno a uno en vez de dar un error genérico. */
      const payload = await response.json().catch(() => null);
      const errors = payload?.errors;

      if (Array.isArray(errors) && errors.length) {
        let focused = false;
        errors.forEach((error) => {
          const target = error.field && form.querySelector(`#${error.field}`);
          if (target) {
            target.setAttribute("aria-invalid", "true");
            if (!focused) { target.focus(); focused = true; }
          }
        });
        const first = errors[0];
        say(first.message ? capitalise(first.message) : MESSAGES.fail, "error");
        return;
      }

      say(payload?.error ? capitalise(payload.error) : MESSAGES.fail, "error");
    } catch (error) {
      say(navigator.onLine === false ? MESSAGES.network : MESSAGES.fail, "error");
    } finally {
      button?.removeAttribute("disabled");
      if (label) label.textContent = original;
    }
  });
}
