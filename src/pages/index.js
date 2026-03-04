import { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Header from "../components/Header";

const TECH_STACK = [
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Three.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg",
  },
  {
    name: "HTML5",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    name: "Supabase",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "GitHub",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
];

function SystemFlow() {
  const NODES = [
    {
      id: "student",
      label: "Student",
      detail: "Starts the session and initiates voting using a verified identity.",
    },
    {
      id: "auth",
      label: "Authentication",
      detail: "Validates user credentials and applies role-based access control.",
    },
    {
      id: "vote",
      label: "Vote Submission",
      detail: "Captures selections, validates rules (one vote, correct election), then sends to the API.",
    },
    {
      id: "record",
      label: "Record Layer",
      detail: "Stores vote records in a tamper-evident way for trust and auditability.",
    },
    {
      id: "results",
      label: "Results and Admin View",
      detail: "Aggregates results and allows admins to manage elections and review outcomes.",
    },
  ];

  const EDGES = [
    ["student", "auth"],
    ["auth", "vote"],
    ["vote", "record"],
    ["record", "results"],
  ];

  const [active, setActive] = useState("auth");
  const [hovered, setHovered] = useState(null);

  const currentId = hovered || active;
  const current = NODES.find((n) => n.id === currentId);
  const isNodeActive = (id) => id === currentId;

  // Highlight path from start to current node (simple "prefix" highlight).
  const reached = new Set();
  reached.add("student");
  for (const [a, b] of EDGES) {
    if (reached.has(a)) reached.add(b);
    if (b === currentId) break;
  }
  const isReached = (id) => reached.has(id);

  return (
    <div className="flowWrap">
      <div className="flowLeft">
        <div className="flowTitle">System Flow Viewer</div>
        <div className="flowHint">Hover to preview | Click to lock focus</div>

        <div className="flowControls">
          <button type="button" className="flowReset" onClick={() => setActive("auth")}>
            Reset focus
          </button>
        </div>

        <div className="flowGraph" role="list">
          {NODES.map((node, idx) => (
            <div key={node.id} className="flowRow">
              <button
                type="button"
                className={
                  isNodeActive(node.id)
                    ? "flowNode active"
                    : isReached(node.id)
                      ? "flowNode reached"
                      : "flowNode"
                }
                onClick={() => setActive(node.id)}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="flowIndex">{idx + 1}</span>
                <span className="flowLabel">{node.label}</span>
              </button>

              {idx < NODES.length - 1 && <div className="flowLine" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flowRight">
        <div className="flowDetailTitle">{current?.label}</div>
        <div className="flowDetailText">{current?.detail}</div>

        <div className="flowMini">
          <div className="flowMiniTitle">Why this matters</div>
          <ul className="flowMiniList">
            <li>Clear boundaries reduce mistakes and misuse.</li>
            <li>Verifiable records improve trust in results.</li>
            <li>Workflow-driven UI prevents invalid actions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ContactBlock() {
  const email = "jason.guijo2160@gmail.com";
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitMessage = async (event) => {
    event.preventDefault();
    if (sending) return;

    const name = form.from_name.trim();
    const senderEmail = form.from_email.trim();
    const message = form.message.trim();

    if (!name || !senderEmail || !message) {
      setToast({
        type: "error",
        text: "Please complete your name, email, and message.",
      });
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email: senderEmail,
          message,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        throw new Error(data?.error || "Send failed");
      }

      setForm({
        from_name: "",
        from_email: "",
        message: "",
      });
      setToast({
        type: "success",
        text: "Message sent successfully.",
      });
    } catch (error) {
      setToast({
        type: "error",
        text:
          error instanceof Error && error.message
            ? error.message
            : "Message was not sent. Please try again in a moment.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contactWrap">
      <div className="contactCard">
        <div className="contactLabel">Send a message</div>

        <form className="contactForm" onSubmit={onSubmitMessage}>
          <label className="contactField">
            <span className="contactFieldLabel">Name</span>
            <input
              type="text"
              name="from_name"
              className="contactInput"
              value={form.from_name}
              onChange={onFieldChange}
              placeholder="Your name"
              required
            />
          </label>

          <label className="contactField">
            <span className="contactFieldLabel">Email</span>
            <input
              type="email"
              name="from_email"
              className="contactInput"
              value={form.from_email}
              onChange={onFieldChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="contactField">
            <span className="contactFieldLabel">Message</span>
            <textarea
              name="message"
              className="contactTextarea"
              value={form.message}
              onChange={onFieldChange}
              placeholder="Tell me what you want to build..."
              rows={4}
              required
            />
          </label>

          <div className="contactRow">
            <div className="contactValue">{email}</div>
            <button type="submit" className="contactBtn" disabled={sending}>
              {sending ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>

        <div className="contactHint">
          Preferred: email | Message sends directly from the site.
        </div>
      </div>

      <div className="contactLinks">
        <a
          className="contactLink"
          href="https://linkedin.com/in/jason2160/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn profile
        </a>

        <a
          className="contactLink"
          href="https://github.com/jason012223"
          target="_blank"
          rel="noreferrer"
        >
          GitHub profile
        </a>
      </div>

      {toast && (
        <div className={toast.type === "success" ? "contactToast success" : "contactToast error"}>
          <span aria-live="polite">{toast.text}</span>
        </div>
      )}
    </div>
  );
}

function AboutExpand() {
  const [open, setOpen] = useState(false);

  return (
    <div className="aboutBox">
      <button
        type="button"
        className="aboutToggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Hide what I'm exploring" : "Show what I'm exploring"}
        <span className="aboutChevron">{open ? "-" : "+"}</span>
      </button>

      <div className={open ? "aboutBody open" : "aboutBody"}>
        <ul className="aboutList">
          <li>System design: roles, permissions, and clean workflows</li>
          <li>Security basics: validation, auth flows, and safe defaults</li>
          <li>Deployment fundamentals: environment variables and hosting</li>
          <li>UI discipline: simple interactions that improve clarity</li>
        </ul>
      </div>
    </div>
  );
}

function useScrollReveal() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = Array.from(document.querySelectorAll("[data-reveal]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("isVisible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -20% 0px" }
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

function replayReveal(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.classList.remove("isVisible");
  void el.offsetWidth;
  el.classList.add("isVisible");
}

function HeroWordmark() {
  return (
    <svg className="heroWordmark" viewBox="0 0 920 320" aria-hidden="true">
      <defs>
        <linearGradient id="wordmarkFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8ff" />
          <stop offset="55%" stopColor="#f8f0ff" />
          <stop offset="100%" stopColor="#ecd6ff" />
        </linearGradient>
      </defs>

      <text x="18" y="120" className="heroWordmarkMain">
        IT SYSTEMS
      </text>
      <text x="18" y="242" className="heroWordmarkMain">
        BUILDER
      </text>
      <text x="24" y="292" className="heroWordmarkSub">
        FULL-STACK PORTFOLIO EDITION
      </text>
    </svg>
  );
}

function TechCarousel() {
  const looped = [...TECH_STACK, ...TECH_STACK];

  return (
    <div className="techCarousel" aria-label="Languages, frameworks, and tools">
      <div className="techCarouselLabel">Stack in Rotation</div>
      <div className="techMarquee" role="list">
        <div className="techMarqueeInner">
          {looped.map((tech, idx) => (
            <span className="techItem" role="listitem" key={`${tech.name}-${idx}`}>
              <span
                className="techIcon"
                aria-hidden="true"
                style={{ backgroundImage: `url("${tech.icon}")` }}
              />
              <span className="techName">{tech.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [open, setOpen] = useState(null);

  const toggle = (key) => {
    setOpen((prev) => (prev === key ? null : key));
  };

  useScrollReveal();

  return (
    <>
      <Head>
        <title>Jason Guijo | Portfolio</title>
        <meta
          name="description"
          content="IT student portfolio focused on secure workflows, system design, and practical full-stack delivery."
        />
        <meta name="theme-color" content="#140a26" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Jason Guijo | Portfolio" />
        <meta
          property="og:description"
          content="Explore systems projects, process maps, and practical full-stack workflows in a custom cartoon-inspired portfolio."
        />
        <meta property="og:image" content="/og-regularshow-portfolio.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jason Guijo | Cartoon Systems Portfolio" />
        <meta
          name="twitter:description"
          content="Secure workflows, deployable systems, and full-stack project thinking."
        />
        <meta name="twitter:image" content="/og-regularshow-portfolio.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </Head>
      <a href="#top" className="skipLink">
        Skip to content
      </a>
      <Header onNavClick={replayReveal} />

      <main id="top">
        <section className="hero reveal" data-reveal>
          <div className="heroScene" aria-hidden="true" />
          <div className="container heroGrid">
            <div className="heroCopy">
              <div className="kicker">
                4th Year IT Student | Polytechnic University of the Philippines | Full-Stack Builder
              </div>

              <h1 className="heroTitle">
                <span className="srOnly">
                  IT-focused systems builder with practical full-stack web experience
                </span>
                <HeroWordmark />
              </h1>

              <p className="heroLead">
                I like building web apps that solve real problems, not just look good on screen. My
                focus is turning messy workflows into clear, usable systems with solid structure and
                security in mind.
              </p>

              <div className="heroActions">
                <a className="btnPrimary" href="#systems">
                  Explore System Map
                </a>
                <a className="btnGhost" href="#contact">
                  Start a Conversation
                </a>
              </div>

              <TechCarousel />
            </div>

            <div className="heroSide">
              <div className="heroPhotoWrap">
                <Image
                  src="/jason.jpg"
                  alt="Jason Gabriel L. Guijo"
                  width={560}
                  height={560}
                  className="heroPhoto"
                  priority
                />
              </div>

              <div className="heroPanel">
                <div className="heroPanelTitle">System Snapshot</div>
                <ul className="heroPanelList">
                  <li>
                    <span className="dot" /> Authentication and roles
                  </li>
                  <li>
                    <span className="dot" /> Data integrity focus
                  </li>
                  <li>
                    <span className="dot" /> Workflow-driven UI
                  </li>
                  <li>
                    <span className="dot" /> Deployable web platform
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="systems" className="section sectionPark reveal" data-reveal>
          <div className="container">
            <h2>Systems</h2>
            <p>These are the foundations I rely on whenever I design and build a system.</p>

            <div className="sysGrid">
              <article className="sysCard">
                <div className="sysTitle">Authentication and Roles</div>
                <div className="sysDesc">
                  Separating student and admin actions with clear access boundaries.
                </div>
                <div className="sysMeta">Applied in: Blockchain University E-Voting System</div>
              </article>

              <article className="sysCard">
                <div className="sysTitle">Data Integrity</div>
                <div className="sysDesc">
                  Designing records to be verifiable and resistant to tampering.
                </div>
                <div className="sysMeta">Applied in: Vote recording and audit trail</div>
              </article>

              <article className="sysCard">
                <div className="sysTitle">Workflow Logic</div>
                <div className="sysDesc">
                  Building predictable flows from setup to voting to results.
                </div>
                <div className="sysMeta">Applied in: Election lifecycle management</div>
              </article>

              <article className="sysCard">
                <div className="sysTitle">Deployable Web Platform</div>
                <div className="sysDesc">
                  Making systems accessible, maintainable, and production-ready.
                </div>
                <div className="sysMeta">Applied in: Web app structure and deployment basics</div>
              </article>
            </div>
          </div>
        </section>

        <section id="projects" className="section sectionDusk reveal" data-reveal>
          <div className="container">
            <h2>Projects</h2>
            <p>
              Here are the projects I built, where real constraints shaped the decisions and final
              implementation.
            </p>

            <div className="projGrid">
              <article className="projCard">
                <button
                  type="button"
                  className="projHead"
                  onClick={() => toggle("evote")}
                  aria-expanded={open === "evote"}
                >
                  <div>
                    <div className="projArt projArtEvote" aria-hidden="true">
                      <span>Election Control Room</span>
                    </div>
                    <div className="projTitle">Blockchain University E-Voting System</div>
                    <div className="projDesc">
                      A web-based voting platform focused on integrity, access control, and auditability.
                    </div>
                    <div className="projChips">
                      <span className="chip">Auth/Roles</span>
                      <span className="chip">Database</span>
                      <span className="chip">API</span>
                      <span className="chip">UI Workflow</span>
                    </div>
                  </div>
                  <div className="projToggle">{open === "evote" ? "-" : "+"}</div>
                </button>

                <div className={open === "evote" ? "projBody open" : "projBody"}>
                  <div className="projSceneStrip projSceneEvote">
                    <span className="projSceneTag">Scene strip</span>
                    <span className="projSceneText">Role gates to ballot validation to results audit</span>
                  </div>
                  <div className="projBodyTitle">System highlights</div>
                  <ul className="projList">
                    <li>Role separation between student and admin operations</li>
                    <li>Election lifecycle: setup to vote casting to results</li>
                    <li>Data integrity design (tamper-evident records)</li>
                  </ul>

                  <div className="projLinks">
                    <a className="btnGhost" href="#process">
                      See system flow
                    </a>
                    <a
                      className="btnGhost"
                      href="https://github.com/jason012223"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </article>

              <article className="projCard">
                <button
                  type="button"
                  className="projHead"
                  onClick={() => toggle("portfolio")}
                  aria-expanded={open === "portfolio"}
                >
                  <div>
                    <div className="projArt projArtPortfolio" aria-hidden="true">
                      <span>Cartoon Systems Studio</span>
                    </div>
                    <div className="projTitle">Interactive Systems Portfolio</div>
                    <div className="projDesc">
                      This portfolio: built to present systems thinking with playful visuals and purposeful interaction.
                    </div>
                    <div className="projChips">
                      <span className="chip">Next.js</span>
                      <span className="chip">UI State</span>
                      <span className="chip">Accessibility</span>
                      <span className="chip">Design Tokens</span>
                    </div>
                  </div>
                  <div className="projToggle">{open === "portfolio" ? "-" : "+"}</div>
                </button>

                <div className={open === "portfolio" ? "projBody open" : "projBody"}>
                  <div className="projSceneStrip projScenePortfolio">
                    <span className="projSceneTag">Scene strip</span>
                    <span className="projSceneText">Cosmic hero to park sections to guided interaction flow</span>
                  </div>
                  <div className="projBodyTitle">System highlights</div>
                  <ul className="projList">
                    <li>Active nav highlighting (IntersectionObserver)</li>
                    <li>Component-like sections with consistent design tokens</li>
                    <li>Expandable project panels (clean UI state)</li>
                  </ul>

                  <div className="projLinks">
                    <a className="btnGhost" href="#contact">
                      Contact
                    </a>
                    <a
                      className="btnGhost"
                      href="https://linkedin.com/in/jason2160/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </article>

              <article className="projCard">
                <button
                  type="button"
                  className="projHead"
                  onClick={() => toggle("photobooth")}
                  aria-expanded={open === "photobooth"}
                >
                  <div>
                    <div className="projArt projArtPhotobooth" aria-hidden="true">
                      <span>K-Photobooth Booth Room</span>
                    </div>
                    <div className="projTitle">Interactive Photobooth App</div>
                    <div className="projDesc">
                      A browser photobooth with guided multi-shot capture, live customization, and
                      share-ready exports.
                    </div>
                    <div className="projChips">
                      <span className="chip">Webcam + Canvas</span>
                      <span className="chip">Filter Pipeline</span>
                      <span className="chip">Stickers/Overlays</span>
                      <span className="chip">GIF + Share</span>
                    </div>
                  </div>
                  <div className="projToggle">{open === "photobooth" ? "-" : "+"}</div>
                </button>

                <div className={open === "photobooth" ? "projBody open" : "projBody"}>
                  <div className="projSceneStrip projScenePhotobooth">
                    <span className="projSceneTag">Scene strip</span>
                    <span className="projSceneText">Countdown capture to stickers/effects to GIF + share</span>
                  </div>
                  <div className="projBodyTitle">System highlights</div>
                  <ul className="projList">
                    <li>Countdown-based shot sequencing with flash, shutter sound, and capture states</li>
                    <li>Live controls: filters, frame color, photo shape, logo language, and stickers</li>
                    <li>Export strip/GIF output with temporary share links and QR-ready sharing flow</li>
                  </ul>

                  <div className="projLinks">
                    <a className="btnGhost" href="#contact">
                      Request demo
                    </a>
                    <a
                      className="btnGhost"
                      href="https://github.com/jason012223"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </article>

              <article className="projCard">
                <button
                  type="button"
                  className="projHead"
                  onClick={() => toggle("museum3d")}
                  aria-expanded={open === "museum3d"}
                >
                  <div>
                    <div className="projArt projArtMuseum" aria-hidden="true">
                      <span>3D Gallery Walkthrough</span>
                    </div>
                    <div className="projTitle">3D Interactive Museum (Three.js)</div>
                    <div className="projDesc">
                      A real-time 3D museum where users roam inside the space, inspect artworks, and
                      explore an immersive mobile-ready experience.
                    </div>
                    <div className="projChips">
                      <span className="chip">Three.js</span>
                      <span className="chip">3D Navigation</span>
                      <span className="chip">Mobile Joystick</span>
                      <span className="chip">Immersive Audio</span>
                    </div>
                  </div>
                  <div className="projToggle">{open === "museum3d" ? "-" : "+"}</div>
                </button>

                <div className={open === "museum3d" ? "projBody open" : "projBody"}>
                  <div className="projSceneStrip projSceneMuseum">
                    <span className="projSceneTag">Scene strip</span>
                    <span className="projSceneText">Roam, listen, tap artwork, read story details</span>
                  </div>
                  <div className="projBodyTitle">System highlights</div>
                  <ul className="projList">
                    <li>Free-roam movement inside the museum using Three.js scene and camera controls</li>
                    <li>Mobile mode includes a virtual joystick so users can navigate smoothly on touch devices</li>
                    <li>Background music auto-plays on entry to set atmosphere from the first load</li>
                    <li>Clicking artworks opens detail information panels for each piece</li>
                  </ul>

                  <div className="projLinks">
                    <a className="btnGhost" href="#contact">
                      Request demo
                    </a>
                    <a
                      className="btnGhost"
                      href="https://github.com/jason012223"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="process" className="section sectionBlueprint reveal" data-reveal>
          <div className="container">
            <h2>Process</h2>
            <p>
              This is my usual workflow: map the flow, secure the logic, validate results, then polish
              the user experience.
            </p>
            <SystemFlow />
          </div>
        </section>

        <section id="about" className="section reveal" data-reveal>
          <div className="container">
            <h2>About</h2>
            <p>
              I&apos;m Jason Gabriel L. Guijo, a 4th year Information Technology student at the
              Polytechnic University of the Philippines. I enjoy building systems that are practical,
              reliable, and easy for people to use.
            </p>
            <p>
              Most of my work is full-stack web development, especially projects involving
              authentication, data integrity, and workflow logic. I&apos;m always aiming to build tools
              that are not only functional, but dependable in real use.
            </p>

            <AboutExpand />
          </div>
        </section>

        <section id="contact" className="section reveal" data-reveal>
          <div className="container">
            <h2>Contact</h2>
            <p>
              If you&apos;d like to collaborate on a project, internship, or system build, feel free to
              message me anytime.
            </p>
            <ContactBlock />
          </div>
        </section>

        <footer className="footer">
          <div className="container footerRow">
            <div className="footerLeft">JG | IT Systems Portfolio</div>
            <div className="footerRight">(c) {new Date().getFullYear()}</div>
          </div>
        </footer>
      </main>
    </>
  );
}
