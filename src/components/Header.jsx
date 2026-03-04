import { useEffect, useState } from "react";

const SECTION_IDS = ["systems", "projects", "process", "about", "contact"];
const NAV_OFFSET = 120;

export default function Header({ onNavClick }) {
  const [activeId, setActiveId] = useState("systems");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (sections.length === 0) return;
    let rafId = 0;
    let ticking = false;

    const updateActiveSection = () => {
      // If scrolled to the very bottom, lock highlight to the last section.
      const isAtPageBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      if (isAtPageBottom) {
        setActiveId(SECTION_IDS[SECTION_IDS.length - 1]);
        return;
      }

      // Pick the last section whose top has crossed the nav offset.
      let nextActive = sections[0].id;
      for (const section of sections) {
        const top = section.getBoundingClientRect().top;
        if (top <= NAV_OFFSET) {
          nextActive = section.id;
        } else {
          break;
        }
      }

      setActiveId(nextActive);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const linkClass = (id) => (activeId === id ? "navLink active" : "navLink");
  const handleNavClick = (event, id) => {
    // Preserve default browser behavior for modified clicks.
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();

    const target = document.getElementById(id);
    if (target) {
      const sectionTop = target.getBoundingClientRect().top + window.scrollY;
      const scrollMarginTop = parseInt(getComputedStyle(target).scrollMarginTop || "0", 10) || 0;
      const top = Math.max(0, sectionTop - scrollMarginTop);

      window.scrollTo({
        top,
        behavior: "smooth",
      });
      window.history.replaceState(null, "", `#${id}`);
    }

    setActiveId(id);
    setMenuOpen(false);
    onNavClick?.(id);
  };

  return (
    <header>
      <div className="container">
        <div className="brandWrap">
          <a href="#top" aria-label="Go to top" className="logo" onClick={() => setMenuOpen(false)}>
            <span className="logoMark">JG</span>
          </a>
          <span className="brandName">Jason Gabriel L. Guijo</span>
        </div>

        <button
          type="button"
          className={menuOpen ? "menuToggle open" : "menuToggle"}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="menuToggleBars" aria-hidden="true" />
        </button>

        <nav
          id="primary-nav"
          className={menuOpen ? "primaryNav open" : "primaryNav"}
          aria-label="Primary"
        >
          <a
            href="#systems"
            className={linkClass("systems")}
            onClick={(event) => handleNavClick(event, "systems")}
            aria-current={activeId === "systems" ? "page" : undefined}
          >
            Systems
          </a>

          <a
            href="#projects"
            className={linkClass("projects")}
            onClick={(event) => handleNavClick(event, "projects")}
            aria-current={activeId === "projects" ? "page" : undefined}
          >
            Projects
          </a>

          <a
            href="#process"
            className={linkClass("process")}
            onClick={(event) => handleNavClick(event, "process")}
            aria-current={activeId === "process" ? "page" : undefined}
          >
            Process
          </a>

          <a
            href="#about"
            className={linkClass("about")}
            onClick={(event) => handleNavClick(event, "about")}
            aria-current={activeId === "about" ? "page" : undefined}
          >
            About
          </a>

          <a
            href="#contact"
            className={linkClass("contact")}
            onClick={(event) => handleNavClick(event, "contact")}
            aria-current={activeId === "contact" ? "page" : undefined}
          >
            Contact
          </a>
        </nav>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="navBackdrop"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}
