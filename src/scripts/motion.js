import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import { initForm } from "./form.js";

gsap.registerPlugin(ScrollTrigger, CustomEase);

/* la curva del sitio: entra lenta, acelera, frena limpio */
CustomEase.create("edit", "0.69, 0, 0.31, 1");

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse = window.matchMedia("(hover: none)").matches;

/* =========================================================
   1. Scroll suave (Lenis) sincronizado con ScrollTrigger
   ========================================================= */
function smoothScroll() {
  if (reduced) return null;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    });
  });

  return lenis;
}

/* =========================================================
   2. Partidor de texto en palabras y letras.
   El texto original queda en aria-label y los trozos en
   aria-hidden, para no romper los lectores de pantalla.
   ========================================================= */
function split(el) {
  if (el.dataset.split === "done") return;
  el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());

  const walk = (node) => {
    const out = document.createDocumentFragment();
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        child.textContent.split(/(\s+)/).forEach((token) => {
          if (!token) return;
          if (/^\s+$/.test(token)) return out.appendChild(document.createTextNode(" "));
          const word = document.createElement("span");
          word.className = "word";
          [...token].forEach((ch) => {
            const c = document.createElement("span");
            c.className = "char";
            c.textContent = ch;
            word.appendChild(c);
          });
          out.appendChild(word);
        });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName === "BR") return out.appendChild(child.cloneNode());
        const clone = child.cloneNode(false);
        clone.appendChild(walk(child));
        out.appendChild(clone);
      }
    });
    return out;
  };

  const frag = walk(el);
  el.textContent = "";
  el.appendChild(frag);
  el.dataset.split = "done";
  el.querySelectorAll(".word, .char").forEach((n) => n.setAttribute("aria-hidden", "true"));
}

/* =========================================================
   3. Titulares: las letras suben desde su máscara
   ========================================================= */
function titles() {
  document.querySelectorAll('[data-anim="title"]').forEach((el) => {
    split(el);
    const chars = el.querySelectorAll(".char");
    if (!chars.length) return;
    gsap.set(el, { autoAlpha: 1 });
    if (reduced) return;

    gsap.from(chars, {
      yPercent: 118,
      duration: 1,
      ease: "edit",
      stagger: 0.016,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });
}

/* =========================================================
   4. Párrafos: las palabras se encienden según bajas.
   Con scrub, para que aparezcan al ritmo del scroll.
   ========================================================= */
function readingReveal() {
  document.querySelectorAll('[data-anim="read"]').forEach((el) => {
    split(el);
    const words = el.querySelectorAll(".word");
    if (!words.length) return;
    gsap.set(el, { autoAlpha: 1 });
    if (reduced) return;

    gsap.fromTo(
      words,
      { opacity: 0.16 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 86%", end: "bottom 60%", scrub: 0.6 },
      }
    );
  });
}

/* =========================================================
   5. Bloques sueltos
   ========================================================= */
function blocks() {
  document.querySelectorAll('[data-anim="fade"]').forEach((el) => {
    gsap.set(el, { autoAlpha: 1 });
    if (reduced) return;
    gsap.from(el, {
      y: 28,
      autoAlpha: 0,
      duration: 1.1,
      ease: "edit",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}

/* =========================================================
   6. Imágenes: máscara que se abre + parallax continuo
   ========================================================= */
function figures() {
  if (reduced) return;

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.3,
        ease: "edit",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      }
    );
  });

  if (coarse) return;
  document.querySelectorAll("[data-parallax]").forEach((layer) => {
    gsap.fromTo(
      layer,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: layer.closest(".fig") || layer,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );
  });
}

/* =========================================================
   7. Filas de servicios escalonadas
   ========================================================= */
function serviceRows() {
  if (reduced) return;
  const list = document.querySelector("[data-rows]");
  if (!list) return;
  gsap.from(list.children, {
    y: 34,
    autoAlpha: 0,
    duration: 0.9,
    ease: "edit",
    stagger: 0.09,
    scrollTrigger: { trigger: list, start: "top 84%", once: true },
  });
}

/* =========================================================
   8. Scramble sobre las etiquetas mono del menú
   ========================================================= */
function scramble() {
  if (reduced || coarse) return;
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/\\<>*#";

  document.querySelectorAll("[data-scramble]").forEach((el) => {
    const final = el.textContent;
    let raf;

    el.addEventListener("pointerenter", () => {
      cancelAnimationFrame(raf);
      let frame = 0;
      const run = () => {
        el.textContent = final
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < frame / 2.4) return final[i];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("");
        frame++;
        if (frame / 2.4 < final.length) raf = requestAnimationFrame(run);
        else el.textContent = final;
      };
      run();
    });

    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      el.textContent = final;
    });
  });
}

/* =========================================================
   9. Cursor con "Ver" sobre las fichas de trabajo
   ========================================================= */
function cursor() {
  if (reduced || coarse) return;

  const dot = document.createElement("div");
  dot.className = "cursor";
  dot.textContent = "View";
  dot.setAttribute("aria-hidden", "true");
  document.body.appendChild(dot);

  const x = gsap.quickTo(dot, "x", { duration: 0.4, ease: "power3" });
  const y = gsap.quickTo(dot, "y", { duration: 0.4, ease: "power3" });
  window.addEventListener("pointermove", (e) => { x(e.clientX); y(e.clientY); }, { passive: true });

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    el.addEventListener("pointerenter", () => dot.classList.add("is-active"));
    el.addEventListener("pointerleave", () => dot.classList.remove("is-active"));
  });
}

/* =========================================================
   10. Cabecera: la marca encoge al bajar
   ========================================================= */
function header() {
  const el = document.querySelector("[data-header]");
  if (!el) return;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => el.classList.toggle("is-stuck", self.scroll() > 60),
  });
}

/* ========================================================= */
function init() {
  document.documentElement.classList.remove("no-js");
  smoothScroll();
  titles();
  readingReveal();
  blocks();
  figures();
  serviceRows();
  scramble();
  cursor();
  header();
  initForm();
  ScrollTrigger.refresh();
}

if (document.readyState !== "loading") init();
else document.addEventListener("DOMContentLoaded", init);

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
