import "./style.scss";

document.addEventListener("DOMContentLoaded", () => {
	const root = document.documentElement;
	const body = document.body;
	const themeButton = document.querySelector("[data-theme-toggle]");
	const langButton = document.querySelector("[data-lang-toggle]");
	const nav = document.querySelector(".site-nav");
	const navToggle = document.querySelector("[data-nav-toggle]");
	const navLinks = [
		...document.querySelectorAll('.nav-link-chip[href^="#"]'),
	];
	const sections = [...document.querySelectorAll("[data-section]")];
	const header = document.querySelector(".site-header");
	const headerShell = document.querySelector(".header-shell");
	const headerTop = document.querySelector(".header-top");
	const backToTop = document.getElementById("backToTop");

	const setTheme = (theme) => {
		root.setAttribute("data-bs-theme", theme);
		try {
			localStorage.setItem("odf-theme", theme);
		} catch {}
	};

	const getPreferredTheme = () => {
		try {
			const saved = localStorage.getItem("odf-theme");
			if (saved === "dark" || saved === "light") return saved;
		} catch {}
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	};

	const setLanguage = (lang) => {
		body.setAttribute("data-lang", lang);
		document.documentElement.lang = lang;
		try {
			localStorage.setItem("odf-lang", lang);
		} catch {}
	};

	const getPreferredLanguage = () => {
		try {
			const saved = localStorage.getItem("odf-lang");
			if (saved === "it" || saved === "en") return saved;
		} catch {}
		return "en";
	};

	const closeMobileNav = () => {
		nav?.classList.remove("is-open");
		navToggle?.setAttribute("aria-expanded", "false");
	};

	const openMobileNav = () => {
		nav?.classList.add("is-open");
		navToggle?.setAttribute("aria-expanded", "true");
	};

	const getClosedHeaderOffset = () => {
		if (!headerShell) return 88;
		const shellStyles = window.getComputedStyle(headerShell);
		const shellPaddingTop = parseFloat(shellStyles.paddingTop || "0");
		const shellPaddingBottom = parseFloat(shellStyles.paddingBottom || "0");
		const topHeight =
			headerTop?.getBoundingClientRect().height ||
			headerShell.getBoundingClientRect().height;
		return Math.ceil(topHeight + shellPaddingTop + shellPaddingBottom + 8);
	};

	const updateHeaderOffset = () => {
		root.style.setProperty(
			"--header-offset",
			`${getClosedHeaderOffset()}px`,
		);
	};

	const scrollToTarget = (target) => {
		updateHeaderOffset();
		const offset = getClosedHeaderOffset();
		const top =
			target.getBoundingClientRect().top + window.scrollY - offset + 2;
		window.scrollTo({ top, behavior: "smooth" });
	};

	const setActiveLink = (id) => {
		navLinks.forEach((link) => {
			const isActive = link.getAttribute("href") === `#${id}`;
			link.classList.toggle("is-active", isActive);
			if (isActive) link.setAttribute("aria-current", "page");
			else link.removeAttribute("aria-current");
		});
	};

	themeButton?.addEventListener("click", () => {
		setTheme(
			root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark",
		);
	});

	langButton?.addEventListener("click", () => {
		setLanguage(body.getAttribute("data-lang") === "en" ? "it" : "en");
	});

	navToggle?.addEventListener("click", () => {
		const expanded = navToggle.getAttribute("aria-expanded") === "true";
		if (expanded) closeMobileNav();
		else openMobileNav();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") closeMobileNav();
	});

	navLinks.forEach((anchor) => {
		anchor.addEventListener("click", (event) => {
			const href = anchor.getAttribute("href");
			if (!href || href === "#") return;
			const target = document.querySelector(href);
			if (!target) return;
			event.preventDefault();
			const isMobileMenuLink =
				window.innerWidth < 992 &&
				nav?.classList.contains("is-open") &&
				nav.contains(anchor);
			setActiveLink(target.id);
			if (isMobileMenuLink) {
				closeMobileNav();
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						scrollToTarget(target);
					});
				});
				return;
			}
			scrollToTarget(target);
		});
	});

	backToTop?.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});

	const sectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) setActiveLink(entry.target.id);
			});
		},
		{ rootMargin: "-30% 0px -55% 0px", threshold: 0.1 },
	);

	sections.forEach((section) => sectionObserver.observe(section));

	/* ============================================
	   IntersectionObserver-driven entrance animations
	   Respects prefers-reduced-motion and works without JS (noscript fallback)
	   ============================================ */
	const prefersReducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	const animElements = document.querySelectorAll(
		".anim-fade-up, .stagger-grid > *",
	);

	if (prefersReducedMotion) {
		animElements.forEach((el) => el.classList.add("is-visible"));
	} else {
		const animObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						animObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1, rootMargin: "0px 0px -24px 0px" },
		);
		animElements.forEach((el) => animObserver.observe(el));
	}

	let lastScroll = 0;
	const onScroll = () => {
		const currentScroll = window.scrollY;
		header?.classList.toggle("is-scrolled", currentScroll > 10);
		lastScroll = currentScroll;
	};

	const onResize = () => {
		updateHeaderOffset();
		if (window.innerWidth >= 992) closeMobileNav();
	};

	setTheme(getPreferredTheme());
	setLanguage(getPreferredLanguage());
	updateHeaderOffset();

	// Initialise active nav from URL hash when available
	const initialHash = window.location.hash.replace("#", "");
	setActiveLink(
		initialHash && document.getElementById(initialHash)
			? initialHash
			: "services",
	);

	onScroll();

	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onResize, { passive: true });
});
