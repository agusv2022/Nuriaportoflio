---
const { brand, nav, contactButton } = Astro.props;
---
<header class="site-header" data-header>
  <div class="wrap bar">
    <a class="brand" href="/">{brand}</a>

    <div class="actions">
      <nav aria-label="Principal">
        <ul>
          {nav.map((item) => (
            <li>
              <a href={item.href}>
                <span class="br">[</span>
                <span class="lb" data-scramble>{item.label}</span>
                <span class="br">]</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <a class="contact" href={contactButton.href}>
        <span class="lb" data-scramble>{contactButton.label}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 L12 4 M6 4 H12 V10" /></svg>
      </a>
    </div>
  </div>
</header>

<style>
  .site-header{
    position:sticky;top:0;z-index:50;background:var(--paper);
    border-bottom:1px solid transparent;
    transition:border-color .45s var(--ease);
  }
  .site-header.is-stuck{border-bottom-color:var(--line)}

  .bar{
    display:flex;align-items:baseline;justify-content:space-between;
    gap:clamp(24px,4vw,72px);
    padding-block:clamp(30px,3.4vw,52px) clamp(22px,2.4vw,34px);
    transition:padding-block .55s var(--ease);
  }
  .site-header.is-stuck .bar{padding-block:16px 14px}

  /* La marca manda: 96px frente a los 52 del H1. */
  .brand{
    font-family:var(--display);font-weight:500;text-decoration:none;
    text-transform:uppercase;line-height:.92;white-space:nowrap;
    font-size:clamp(30px,6.4vw,96px);
    letter-spacing:.005em;
    transition:font-size .55s var(--ease),letter-spacing .55s var(--ease);
  }
  .site-header.is-stuck .brand{
    font-size:clamp(19px,2.2vw,27px);letter-spacing:.06em;
  }

  /* Nav y contacto comparten línea base: misma familia, mismo cuerpo. */
  .actions{
    display:flex;align-items:baseline;
    gap:clamp(26px,3.6vw,64px);
  }

  nav ul{
    display:flex;gap:clamp(10px,1.4vw,22px);
    list-style:none;margin:0;padding:0;
  }
  nav a,.contact{
    font-family:var(--mono);font-size:11px;font-weight:400;
    letter-spacing:.1em;text-transform:uppercase;text-decoration:none;
    white-space:nowrap;color:var(--ink);
  }
  nav a{
    display:inline-flex;align-items:baseline;gap:7px;
    transition:color .3s var(--ease);
  }
  nav .br{
    color:var(--gray);display:inline-block;
    transition:color .3s var(--ease),transform .4s var(--ease);
  }
  nav a:hover,nav a:focus-visible{color:var(--blue-ink)}
  nav a:hover .br{color:var(--blue)}
  nav a:hover .br:first-child{transform:translateX(-3px)}
  nav a:hover .br:last-child{transform:translateX(3px)}

  .contact{
    display:inline-flex;align-items:baseline;gap:9px;
    padding-bottom:6px;border-bottom:1.5px solid var(--ink);
    transition:color .3s var(--ease),border-color .3s var(--ease);
  }
  .contact svg{
    width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.6;
    align-self:center;transition:transform .4s var(--ease);
  }
  .contact:hover,.contact:focus-visible{color:var(--blue-ink);border-color:var(--blue-ink)}
  .contact:hover svg{transform:translate(3px,-3px)}

  @media(max-width:1024px){
    .bar{padding-block:26px 20px}
    .actions{gap:24px}
    nav ul{gap:8px}
    nav a,.contact{font-size:10px}
    nav a{gap:5px}
  }

  /* En móvil el contacto se ancla abajo, donde llega el pulgar */
  @media(max-width:640px){
    .bar{
      flex-direction:column;align-items:flex-start;gap:16px;
      padding-block:22px 16px;
    }
    .brand{font-size:clamp(26px,8.4vw,40px)}
    .site-header.is-stuck .brand{font-size:19px}
    .actions{width:100%}
    nav ul{flex-wrap:wrap;gap:6px}
    .contact{
      position:fixed;z-index:60;
      bottom:14px;right:14px;left:14px;
      justify-content:center;background:var(--paper);
      border:1px solid var(--ink);padding:15px 20px;
    }
  }
</style>
