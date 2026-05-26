var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const appWindow = window;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const homeSectionIds = ["about", "services", "industries", "approach"];
const ACTIVE_SERVICE_STORAGE_KEY = "mase-active-service";
const queryAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const query = (selector, root = document) => root.querySelector(selector);
const initDocumentState = () => {
    document.documentElement.classList.add("js-ready");
};
const initSkipLink = () => {
    const skipLink = query(".skip-link");
    if (!skipLink) {
        return;
    }
    skipLink.addEventListener("click", () => {
        const targetId = skipLink.getAttribute("href");
        const target = targetId ? query(targetId) : null;
        if (target) {
            target.setAttribute("tabindex", "-1");
            target.focus();
        }
    });
};
const initNavigation = () => {
    var _a;
    const nav = query("#nav");
    const mobileOverlay = query("#mobile-nav-overlay");
    const hamburger = query("#hamburger");
    const closeButton = query("#close-btn");
    const mobileLinks = queryAll(".mobile-nav-link, .mobile-nav-cta, .mobile-nav-sub-link");
    const dropdownItems = queryAll(".nav-item[data-dropdown]");
    const mobileToggleButtons = queryAll(".mobile-nav-toggle");
    const page = (_a = document.body.dataset.page) !== null && _a !== void 0 ? _a : "home";
    const gsap = appWindow.gsap;
    if (!nav || !mobileOverlay || !hamburger || !closeButton) {
        return;
    }
    const updateScrolled = () => {
        nav.classList.toggle("scrolled", window.scrollY > 80);
    };
    const setActiveLinks = () => {
        var _a, _b;
        const allSectionLinks = queryAll("[data-section-link]");
        allSectionLinks.forEach((link) => link.classList.remove("active"));
        if (page !== "home") {
            if (page === "services") {
                queryAll('a[href="./index.html"], a[href="./index.html"]').forEach((link) => link.classList.add("active"));
            }
            if (page === "industries") {
                queryAll('a[href="./index.html"]').forEach((link) => link.classList.add("active"));
            }
            return;
        }
        const probeLine = window.innerHeight * 0.35;
        const sections = homeSectionIds
            .map((id) => document.getElementById(id))
            .filter((section) => Boolean(section));
        const visibleSection = (_b = (_a = sections.find((section) => {
            const rect = section.getBoundingClientRect();
            return rect.top <= probeLine && rect.bottom >= probeLine;
        })) !== null && _a !== void 0 ? _a : [...sections].reverse().find((section) => section.getBoundingClientRect().top <= probeLine)) !== null && _b !== void 0 ? _b : null;
        if (!visibleSection) {
            return;
        }
        queryAll(`[data-section-link="${visibleSection.id}"]`).forEach((link) => link.classList.add("active"));
    };
    const closeDropdowns = () => {
        dropdownItems.forEach((item) => {
            var _a, _b, _c;
            (_a = item.querySelector(".nav-dropdown")) === null || _a === void 0 ? void 0 : _a.classList.remove("open");
            (_b = item.querySelector(".nav-chevron-btn")) === null || _b === void 0 ? void 0 : _b.classList.remove("open");
            (_c = item.querySelector(".nav-chevron-btn")) === null || _c === void 0 ? void 0 : _c.setAttribute("aria-expanded", "false");
        });
    };
    dropdownItems.forEach((item) => {
        const button = item.querySelector(".nav-chevron-btn");
        const menu = item.querySelector(".nav-dropdown");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const isOpen = menu.classList.contains("open");
            closeDropdowns();
            if (!isOpen) {
                menu.classList.add("open");
                button.classList.add("open");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });
    document.addEventListener("mousedown", (event) => {
        const target = event.target;
        if (!nav.contains(target)) {
            closeDropdowns();
        }
    });
    let menuOpen = false;
    const animateOverlay = (open) => {
        if (!gsap || prefersReducedMotion) {
            mobileOverlay.classList.toggle("active", open);
            mobileOverlay.setAttribute("aria-hidden", open ? "false" : "true");
            document.body.classList.toggle("menu-open", open);
            return;
        }
        if (open) {
            mobileOverlay.classList.add("active");
            mobileOverlay.setAttribute("aria-hidden", "false");
            document.body.classList.add("menu-open");
            gsap.fromTo(mobileOverlay, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" });
            gsap.fromTo(mobileLinks, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.26, stagger: 0.04, ease: "power2.out", delay: 0.04 });
            return;
        }
        gsap.fromTo(mobileOverlay, { opacity: 1, y: 0 }, {
            opacity: 0,
            y: -8,
            duration: 0.22,
            ease: "power2.in",
            onComplete: () => {
                mobileOverlay.classList.remove("active");
                mobileOverlay.setAttribute("aria-hidden", "true");
                document.body.classList.remove("menu-open");
            },
        });
    };
    const openMenu = () => {
        if (menuOpen) {
            return;
        }
        menuOpen = true;
        hamburger.setAttribute("aria-expanded", "true");
        animateOverlay(true);
    };
    const closeMenu = () => {
        if (!menuOpen) {
            return;
        }
        menuOpen = false;
        hamburger.setAttribute("aria-expanded", "false");
        animateOverlay(false);
    };
    hamburger.addEventListener("click", openMenu);
    closeButton.addEventListener("click", closeMenu);
    mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));
    mobileToggleButtons.forEach((button) => {
        const groupName = button.dataset.mobileGroup;
        const panel = groupName ? query(`[data-mobile-panel="${groupName}"]`) : null;
        if (!panel) {
            return;
        }
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const isOpen = panel.classList.toggle("open");
            button.classList.toggle("open", isOpen);
            button.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    });
    window.addEventListener("scroll", () => {
        updateScrolled();
        setActiveLinks();
    });
    updateScrolled();
    setActiveLinks();
};
const initServiceAccordion = () => {
    const panels = queryAll("[data-service-panel]");
    const isTouchPanelViewport = () => window.matchMedia("(max-width: 767px), (hover: none), (pointer: coarse)").matches;
    const feedbackTimers = new Map();
    if (!panels.length) {
        return;
    }
    const clearPanelFeedback = (panel) => {
        const timer = feedbackTimers.get(panel);
        if (timer) {
            window.clearTimeout(timer);
            feedbackTimers.delete(panel);
        }
        panel.classList.remove("mobile-touch-feedback");
    };
    const showPanelFeedback = (panel, duration = 360) => {
        clearPanelFeedback(panel);
        panel.classList.add("mobile-touch-feedback");
        const timer = window.setTimeout(() => {
            clearPanelFeedback(panel);
        }, duration);
        feedbackTimers.set(panel, timer);
    };
    const activatePanel = (slug) => {
        let activePanel = null;
        panels.forEach((panel) => {
            const isActive = panel.dataset.serviceSlug === slug;
            panel.classList.toggle("active", isActive);
            panel.setAttribute("aria-selected", isActive ? "true" : "false");
            if (isActive) {
                activePanel = panel;
            }
        });
        if (activePanel) {
            sessionStorage.setItem(ACTIVE_SERVICE_STORAGE_KEY, slug);
        }
    };
    panels.forEach((panel) => {
        panel.addEventListener("pointerdown", () => {
            if (!isTouchPanelViewport() || panel.classList.contains("active")) {
                return;
            }
            showPanelFeedback(panel, 420);
        });
        panel.addEventListener("pointercancel", () => {
            clearPanelFeedback(panel);
        });
        panel.addEventListener("click", (event) => {
            const slug = panel.dataset.serviceSlug;
            if (!slug) {
                return;
            }
            if (isTouchPanelViewport() && !panel.classList.contains("active")) {
                event.preventDefault();
                showPanelFeedback(panel, 420);
                window.setTimeout(() => {
                    clearPanelFeedback(panel);
                    activatePanel(slug);
                }, 320);
                return;
            }
            activatePanel(slug);
        });
    });
    const serviceLinks = queryAll("[data-service-link]");
    serviceLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            var _a;
            const slug = link.dataset.serviceLink;
            if (!slug) {
                return;
            }
            if (document.body.dataset.page === "home") {
                event.preventDefault();
                activatePanel(slug);
                history.replaceState(null, "", `#services/${slug}`);
                (_a = document.getElementById("services")) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            else {
                sessionStorage.setItem(ACTIVE_SERVICE_STORAGE_KEY, slug);
            }
        });
    });
    const applyInitialState = () => {
        var _a, _b, _c;
        const hashMatch = window.location.hash.match(/^#services\/([a-z-]+)$/);
        const stored = sessionStorage.getItem(ACTIVE_SERVICE_STORAGE_KEY);
        const slug = (_b = (_a = hashMatch === null || hashMatch === void 0 ? void 0 : hashMatch[1]) !== null && _a !== void 0 ? _a : stored) !== null && _b !== void 0 ? _b : (_c = panels[0]) === null || _c === void 0 ? void 0 : _c.dataset.serviceSlug;
        if (slug) {
            activatePanel(slug);
        }
    };
    applyInitialState();
};
const initServicesDetail = () => {
    var _a, _b;
    const blocks = queryAll("[data-service-block]");
    const detailPanel = query("[data-services-detail-panel]");
    if (!blocks.length || !detailPanel) {
        return;
    }
    const intro = query("[data-services-intro]", detailPanel);
    const numberEl = query("[data-services-number]", detailPanel);
    const titleEl = query("[data-services-title]", detailPanel);
    const descriptionEl = query("[data-services-description]", detailPanel);
    const animatedDetail = query(".sp-left-animated", detailPanel);
    const setDetail = (detail) => {
        if (intro) {
            intro.hidden = true;
        }
        if (numberEl) {
            numberEl.hidden = false;
            numberEl.textContent = detail.number;
        }
        if (titleEl) {
            titleEl.hidden = false;
            titleEl.textContent = detail.title;
        }
        if (descriptionEl) {
            descriptionEl.hidden = false;
            descriptionEl.textContent = detail.description;
        }
        if (animatedDetail && appWindow.gsap && !prefersReducedMotion) {
            appWindow.gsap.fromTo(animatedDetail, { opacity: 0, y: 14 }, {
                opacity: 1,
                y: 0,
                duration: 0.34,
                ease: "power3.out",
                clearProps: "transform,opacity",
            });
        }
    };
    const activateBlock = (block) => {
        var _a, _b, _c;
        blocks.forEach((item) => item.classList.remove("is-active"));
        block.classList.add("is-active");
        const detail = {
            number: (_a = block.dataset.serviceNumber) !== null && _a !== void 0 ? _a : "",
            title: (_b = block.dataset.serviceTitle) !== null && _b !== void 0 ? _b : "",
            description: (_c = block.dataset.serviceDescription) !== null && _c !== void 0 ? _c : "",
        };
        setDetail(detail);
    };
    const observer = new IntersectionObserver((entries) => {
        const activeEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)[0];
        if (activeEntry) {
            activateBlock(activeEntry.target);
        }
    }, { rootMargin: "-20% 0px -30% 0px", threshold: [0.2, 0.35, 0.5, 0.75] });
    blocks.forEach((block) => {
        observer.observe(block);
        block.addEventListener("mouseenter", () => activateBlock(block));
    });
    const hash = window.location.hash.replace("#", "");
    const target = (_b = (_a = blocks.find((block) => block.id === hash)) !== null && _a !== void 0 ? _a : blocks.find((block) => block.id === sessionStorage.getItem(ACTIVE_SERVICE_STORAGE_KEY))) !== null && _b !== void 0 ? _b : blocks[0];
    if (target) {
        activateBlock(target);
    }
};
const initInteractiveGrid = () => {
    const canvases = queryAll(".interactive-grid-canvas");
    canvases.forEach((canvas) => {
        var _a;
        const variant = (_a = canvas.dataset.gridVariant) !== null && _a !== void 0 ? _a : "hero";
        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }
        let width = 0;
        let height = 0;
        let columns = 0;
        let rows = 0;
        const squareSize = 40;
        const mouse = { x: -9999, y: -9999 };
        let mouseActive = false;
        const ripples = [];
        let frameId = 0;
        const init = () => {
            const parent = canvas.parentElement;
            width = canvas.width = parent ? parent.clientWidth : window.innerWidth;
            height = canvas.height = parent ? parent.clientHeight : window.innerHeight;
            columns = Math.ceil(width / squareSize);
            rows = Math.ceil(height / squareSize);
        };
        const noise = (x, y, time) => (Math.sin(x * 0.0137 + time * 0.22 + 1.3) * 0.5 +
            Math.sin(y * 0.0171 + time * 0.17 + 2.7) * 0.5 +
            Math.sin((x * 0.73 - y * 0.67) * 0.011 + time * 0.28 + 4.1) * 0.6 +
            Math.sin((x * 0.31 + y * 0.95) * 0.019 + time * 0.12 + 0.8) * 0.4) / 2;
        const diagonalFade = (x, y) => {
            const nx = 1 - x / width;
            const ny = y / height;
            const diagonal = (nx + ny) / 2;
            const fade = 1 - Math.min(diagonal / 0.65, 1);
            return Math.pow(fade, 1.2);
        };
        const getCellFade = (x, y) => variant === "section" ? 1 : diagonalFade(x, y);
        const handleResize = () => init();
        const handlePointerMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
            mouseActive = true;
        };
        const handlePointerLeave = () => {
            mouseActive = false;
        };
        const handlePointerDown = (event) => {
            const rect = canvas.getBoundingClientRect();
            ripples.push({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
                radius: 0,
                alpha: 0.7,
            });
        };
        const drawFrame = () => {
            context.clearRect(0, 0, width, height);
            const time = Date.now() * 0.001;
            const pulse = 0.82 + 0.18 * Math.sin(time * 2);
            const mouseRadius = 280;
            for (let row = 0; row < rows; row += 1) {
                for (let column = 0; column < columns; column += 1) {
                    const x = column * squareSize;
                    const y = row * squareSize;
                    const centerX = x + squareSize / 2;
                    const centerY = y + squareSize / 2;
                    const fade = getCellFade(centerX, centerY);
                    if (fade < 0.005) {
                        continue;
                    }
                    const noiseValue = noise(x, y, time);
                    let waveAlpha = 0;
                    if (noiseValue > 0.2 && noiseValue < 0.55) {
                        const bandCenter = 0.375;
                        const bandWidth = 0.175;
                        waveAlpha = 1 - Math.abs(noiseValue - bandCenter) / bandWidth;
                        waveAlpha = Math.pow(Math.max(0, waveAlpha), 1.2) * 0.9;
                    }
                    let alpha = waveAlpha * fade;
                    if (mouseActive) {
                        const distanceX = centerX - mouse.x;
                        const distanceY = centerY - mouse.y;
                        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                        if (distance < mouseRadius) {
                            alpha += Math.pow(1 - distance / mouseRadius, 2) * 0.35;
                        }
                    }
                    ripples.forEach((ripple) => {
                        const rippleX = centerX - ripple.x;
                        const rippleY = centerY - ripple.y;
                        const rippleDistance = Math.sqrt(rippleX * rippleX + rippleY * rippleY);
                        const ringWidth = 50;
                        if (rippleDistance > ripple.radius - ringWidth && rippleDistance < ripple.radius + ringWidth) {
                            const ringDistance = Math.abs(rippleDistance - ripple.radius) / ringWidth;
                            alpha += (1 - ringDistance) * ripple.alpha * 0.4;
                        }
                    });
                    alpha = Math.min(alpha, 1) * pulse;
                    if (alpha > 0.008) {
                        const fillStrength = variant === "section" ? 0.16 : 0.12;
                        const strokeStrength = variant === "section" ? 1.18 : 1;
                        context.fillStyle = `rgba(29,106,90,${alpha * fillStrength})`;
                        context.fillRect(x + 1, y + 1, squareSize - 2, squareSize - 2);
                        const gradient = context.createRadialGradient(centerX, centerY, 2, centerX, centerY, squareSize);
                        gradient.addColorStop(0, `rgba(29,106,90,${Math.min(alpha * strokeStrength, 1)})`);
                        gradient.addColorStop(1, "rgba(29,106,90,0)");
                        context.strokeStyle = gradient;
                        context.lineWidth = 1.3;
                        context.strokeRect(x + 0.5, y + 0.5, squareSize - 1, squareSize - 1);
                    }
                }
            }
            for (let index = ripples.length - 1; index >= 0; index -= 1) {
                ripples[index].radius += 3.5;
                ripples[index].alpha -= 0.006;
                if (ripples[index].alpha <= 0) {
                    ripples.splice(index, 1);
                }
            }
            frameId = window.requestAnimationFrame(drawFrame);
        };
        init();
        drawFrame();
        window.addEventListener("resize", handleResize);
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerleave", handlePointerLeave);
        window.addEventListener("pointerdown", handlePointerDown);
        window.addEventListener("beforeunload", () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerleave", handlePointerLeave);
            window.removeEventListener("pointerdown", handlePointerDown);
            cancelAnimationFrame(frameId);
        });
    });
};
const initPrincipleIconLoops = () => {
    const icons = queryAll(".principle-icon");
    if (!icons.length) {
        return;
    }
    if (prefersReducedMotion) {
        icons.forEach((icon) => icon.classList.add("is-visible"));
        return;
    }
    icons.forEach((icon, iconIndex) => {
        const svg = query("svg", icon);
        if (!svg) {
            return;
        }
        svg.classList.add("principle-icon-svg");
        icon.classList.add("is-visible");
        const drawableNodes = queryAll("path, rect, circle, line, polyline, polygon, ellipse", svg);
        drawableNodes.forEach((node, nodeIndex) => {
            node.setAttribute("pathLength", "1");
            node.style.setProperty("--stroke-delay", `${iconIndex * 0.18 + nodeIndex * 0.08}s`);
        });
    });
};
const initHeroImage = () => {
    const image = query("#hero-image");
    if (!image) {
        return;
    }
    const updateSize = () => {
        const viewportWidth = window.innerWidth;
        const isMobile = viewportWidth < 768;
        const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
        const startWidth = isMobile ? viewportWidth - 48 : isTablet ? viewportWidth - 80 : 1100;
        const startHeight = isMobile ? 320 : isTablet ? 390 : 480;
        const endHeight = isMobile ? window.innerHeight * 0.62 : window.innerHeight * 0.8;
        const progress = Math.min(Math.max(window.scrollY / 400, 0), 1);
        image.style.width = `calc(${startWidth}px + (max(80vw, 100%) - ${startWidth}px) * ${progress})`;
        image.style.maxWidth = `calc(100% + (max(80vw, 100%) - 100%) * ${progress})`;
        image.style.height = `calc(${startHeight}px + (${endHeight}px - ${startHeight}px) * ${progress})`;
    };
    window.addEventListener("scroll", updateSize);
    window.addEventListener("resize", updateSize);
    updateSize();
};
// Deliberately more visible than the React baseline while keeping the same elegant direction.
const REVEAL_EASE = "power3.out";
const REVEAL_START = "top 65%";
const setupHeroTimeline = (gsap) => {
    const heroLabel = query('[data-hero-sequence="label"]');
    const heroHeadlineWords = queryAll("#hero-headline span");
    const heroSubtext = query('[data-hero-sequence="subtext"]');
    const heroCtasWrap = query('[data-hero-sequence="ctas"]');
    const heroCtaLinks = heroCtasWrap ? queryAll("a", heroCtasWrap) : [];
    const heroImage = query('[data-hero-sequence="image"]');
    const heroRule = query('[data-hero-sequence="rule"]');
    if (!heroHeadlineWords.length && !heroLabel && !heroImage) {
        return;
    }
    if (heroLabel) {
        gsap.set(heroLabel, { opacity: 0, y: 12 });
    }
    if (heroHeadlineWords.length) {
        gsap.set(heroHeadlineWords, { opacity: 0, y: 20 });
    }
    if (heroSubtext) {
        gsap.set(heroSubtext, { opacity: 0, y: 16 });
    }
    if (heroCtaLinks.length) {
        gsap.set(heroCtaLinks, { opacity: 0, y: 12 });
    }
    if (heroImage) {
        gsap.set(heroImage, { opacity: 0, y: 38 });
    }
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" }, delay: 0.05 });
    if (heroLabel) {
        timeline.to(heroLabel, {
            opacity: 1,
            y: 0,
            duration: 0.42,
            clearProps: "transform,opacity",
        });
    }
    if (heroHeadlineWords.length) {
        timeline.to(heroHeadlineWords, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.035,
            clearProps: "transform,opacity",
        }, heroLabel ? "-=0.08" : 0);
    }
    if (heroSubtext) {
        timeline.to(heroSubtext, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            clearProps: "transform,opacity",
        });
    }
    if (heroCtaLinks.length) {
        timeline.to(heroCtaLinks, {
            opacity: 1,
            y: 0,
            duration: 0.44,
            stagger: 0.08,
            clearProps: "transform,opacity",
        }, "-=0.18");
    }
    if (heroImage) {
        timeline.to(heroImage, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity",
        }, "-=0.18");
    }
    if (heroRule) {
        timeline.fromTo(heroRule, { width: "0%" }, { width: "100%", duration: 0.8, ease: "power2.out" }, "-=0.2");
    }
};
const setupPageHero = (gsap) => {
    const pageHero = query("[data-page-hero]");
    if (!pageHero) {
        return;
    }
    gsap.set(pageHero, { opacity: 0, y: 44 });
    gsap.to(pageHero, {
        opacity: 1,
        y: 0,
        duration: 1.05,
        delay: 0.05,
        ease: REVEAL_EASE,
        clearProps: "transform,opacity",
    });
};
const setupRevealOnScroll = (gsap, ScrollTrigger) => {
    const elements = queryAll(".reveal-on-scroll");
    if (!elements.length) {
        return;
    }
    gsap.set(elements, { opacity: 0, y: 44 });
    elements.forEach((element) => {
        ScrollTrigger.create({
            trigger: element,
            start: REVEAL_START,
            once: true,
            onEnter: () => {
                gsap.to(element, {
                    opacity: 1,
                    y: 0,
                    duration: 1.05,
                    delay: element.classList.contains("contact-form") ? 0.08 : 0,
                    ease: REVEAL_EASE,
                    clearProps: "transform,opacity",
                });
            },
        });
    });
};
const setupStaggerGroups = (gsap, ScrollTrigger) => {
    queryAll("[data-stagger-group]").forEach((group) => {
        const items = queryAll("[data-stagger-item]", group);
        if (!items.length) {
            return;
        }
        items.forEach((item, index) => {
            gsap.set(item, { opacity: 0, y: 46 });
            ScrollTrigger.create({
                trigger: item,
                start: REVEAL_START,
                once: true,
                onEnter: () => {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        delay: index * 0.085,
                        ease: REVEAL_EASE,
                        clearProps: "transform,opacity",
                    });
                },
            });
        });
    });
};
const setupServicesPageBlocks = (gsap, ScrollTrigger) => {
    queryAll(".sp-block-header").forEach((header) => {
        gsap.set(header, { opacity: 0, y: 44 });
        ScrollTrigger.create({
            trigger: header,
            start: REVEAL_START,
            once: true,
            onEnter: () => {
                gsap.to(header, {
                    opacity: 1,
                    y: 0,
                    duration: 1.05,
                    ease: REVEAL_EASE,
                    clearProps: "transform,opacity",
                });
            },
        });
    });
    queryAll(".sp-capabilities").forEach((group) => {
        const items = queryAll(".sp-capability", group);
        if (!items.length) {
            return;
        }
        items.forEach((item, index) => {
            gsap.set(item, { opacity: 0, y: 42 });
            ScrollTrigger.create({
                trigger: item,
                start: REVEAL_START,
                once: true,
                onEnter: () => {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: 0.95,
                        delay: index * 0.075,
                        ease: REVEAL_EASE,
                        clearProps: "transform,opacity",
                    });
                },
            });
        });
    });
};
const setupIndustriesPageCards = (gsap, ScrollTrigger) => {
    queryAll(".ind-card").forEach((card) => {
        const tab = query(".ind-card-tab", card);
        const image = query(".ind-card-image", card);
        if (tab) {
            gsap.set(tab, { opacity: 0, y: 42 });
        }
        if (image) {
            gsap.set(image, { opacity: 0, scale: 1.04 });
        }
        ScrollTrigger.create({
            trigger: card,
            start: REVEAL_START,
            once: true,
            onEnter: () => {
                if (tab) {
                    gsap.to(tab, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: REVEAL_EASE,
                        clearProps: "transform,opacity",
                    });
                }
                if (image) {
                    gsap.to(image, {
                        opacity: 1,
                        scale: 1,
                        duration: 1.08,
                        ease: REVEAL_EASE,
                        clearProps: "transform,opacity",
                    });
                }
            },
        });
    });
};
// CSS-class fallback used only if GSAP fails to load (CDN blocked, offline).
// The transition is declared in styles.css under `[data-anim-fallback]` so the
// browser registers it before the value flip — avoiding the same-tick footgun.
const initFallbackEntrances = () => {
    const targets = [
        ...queryAll(".reveal-on-scroll"),
        ...queryAll("[data-stagger-item]"),
        ...queryAll(".sp-block-header"),
        ...queryAll(".sp-capability"),
        ...queryAll(".ind-card-tab"),
        ...queryAll(".ind-card-image"),
    ];
    const pageHero = query("[data-page-hero]");
    if (pageHero)
        targets.push(pageHero);
    targets.forEach((element) => element.setAttribute("data-anim-fallback", ""));
    if (!("IntersectionObserver" in window)) {
        targets.forEach((element) => element.setAttribute("data-anim-fallback", "visible"));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting)
                return;
            entry.target.setAttribute("data-anim-fallback", "visible");
            observer.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -35% 0px", threshold: 0.05 });
    targets.forEach((element) => observer.observe(element));
    // Reveal hero immediately on load.
    const heroSequence = [
        query('[data-hero-sequence="label"]'),
        ...queryAll("#hero-headline span"),
        query('[data-hero-sequence="subtext"]'),
        ...queryAll('[data-hero-sequence="ctas"] a'),
        query('[data-hero-sequence="image"]'),
    ].filter((element) => Boolean(element));
    heroSequence.forEach((element, index) => {
        element.setAttribute("data-anim-fallback", "");
        window.setTimeout(() => element.setAttribute("data-anim-fallback", "visible"), 30 + index * 55);
    });
};
const initEntrances = () => {
    const gsap = appWindow.gsap;
    const ScrollTrigger = appWindow.ScrollTrigger;
    console.log("[entrances] gsap available:", Boolean(gsap));
    console.log("[entrances] ScrollTrigger available:", Boolean(ScrollTrigger));
    console.log("[entrances] prefers-reduced-motion:", prefersReducedMotion);
    if (prefersReducedMotion) {
        document.documentElement.dataset.animationEngine = "reduced-motion";
        return;
    }
    if (!gsap || !ScrollTrigger) {
        console.warn("[entrances] GSAP unavailable — using CSS fallback");
        document.documentElement.dataset.animationEngine = "fallback";
        initFallbackEntrances();
        return;
    }
    document.documentElement.dataset.animationEngine = "gsap";
    if (typeof gsap.registerPlugin === "function") {
        gsap.registerPlugin(ScrollTrigger);
    }
    setupHeroTimeline(gsap);
    setupPageHero(gsap);
    setupRevealOnScroll(gsap, ScrollTrigger);
    setupStaggerGroups(gsap, ScrollTrigger);
    setupServicesPageBlocks(gsap, ScrollTrigger);
    setupIndustriesPageCards(gsap, ScrollTrigger);
    window.setTimeout(() => { var _a; return (_a = ScrollTrigger.refresh) === null || _a === void 0 ? void 0 : _a.call(ScrollTrigger); }, 250);
};
const initGsapEnhancements = () => {
    var _a;
    const gsap = appWindow.gsap;
    if (prefersReducedMotion || !gsap || !appWindow.ScrollTrigger) {
        return;
    }
    const brandLine = query("[data-brand-line]");
    if (brandLine) {
        const originalText = (_a = brandLine.textContent) !== null && _a !== void 0 ? _a : "";
        const words = originalText.trim().split(/\s+/);
        brandLine.innerHTML = words
            .map((word) => {
            const letters = word
                .split("")
                .map((character) => `<span class="character-scrub-letter">${character}</span>`)
                .join("");
            return `<span class="character-scrub-word">${letters}</span>`;
        })
            .join('<span class="character-scrub-space" aria-hidden="true"> </span>');
        const chars = queryAll(".character-scrub-letter", brandLine);
        gsap.from(chars, {
            opacity: 0.24,
            color: "rgba(245,244,240,0.42)",
            stagger: 0.015,
            duration: 0.35,
            ease: "none",
            scrollTrigger: {
                trigger: brandLine,
                start: "top 85%",
                end: "bottom 55%",
                scrub: true,
            },
        });
    }
    const processTimeline = query(".process-timeline");
    const axisProgress = query(".process-axis-progress");
    if (appWindow.ScrollTrigger && processTimeline && axisProgress) {
        gsap.fromTo(axisProgress, { scaleY: 0, transformOrigin: "top center" }, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
                trigger: processTimeline,
                start: "top 82%",
                end: "bottom 28%",
                scrub: 0.45,
            },
        });
    }
    queryAll(".process-step").forEach((step) => {
        var _a;
        const marker = query(".process-step-marker", step);
        const glow = query(".process-step-marker-glow", step);
        const left = query(".process-step-left", step);
        const index = query(".process-step-index", step);
        const title = query(".process-step-left h3", step);
        const copy = query(".process-step-right p", step);
        if (!appWindow.ScrollTrigger || !marker || !left || !index || !title || !copy) {
            return;
        }
        const inactiveMarker = {
            scale: 1,
            backgroundColor: "var(--charcoal)",
            borderColor: "rgba(28, 28, 30, 0.35)",
        };
        const activeMarker = {
            scale: 1.45,
            backgroundColor: "var(--teal-tint)",
            borderColor: "rgba(29, 106, 90, 0.9)",
        };
        const revealEase = "power3.out";
        gsap.set(left, { opacity: 0.35 });
        gsap.set(index, { opacity: 0, y: 16 });
        gsap.set(title, { opacity: 0, y: 20 });
        gsap.set(copy, { opacity: 0, y: 20 });
        gsap.set(marker, inactiveMarker);
        if (glow) {
            gsap.set(glow, { opacity: 0, scale: 0.8 });
        }
        const activateStep = () => {
            gsap.to(left, {
                opacity: 1,
                duration: 0.5,
                ease: revealEase,
                overwrite: true,
            });
            gsap.to(index, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: revealEase,
                overwrite: true,
            });
            gsap.to(title, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.08,
                ease: revealEase,
                overwrite: true,
            });
            gsap.to(copy, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.16,
                ease: revealEase,
                overwrite: true,
            });
            gsap.to(marker, Object.assign(Object.assign({}, activeMarker), { duration: 0.55, ease: revealEase, overwrite: true }));
            if (glow) {
                gsap.to(glow, {
                    opacity: 0.42,
                    scale: 1.25,
                    duration: 0.55,
                    ease: revealEase,
                    overwrite: true,
                });
            }
        };
        const deactivateStep = () => {
            gsap.to(left, {
                opacity: 0.35,
                duration: 0.5,
                ease: revealEase,
                overwrite: true,
            });
            gsap.to(index, {
                opacity: 0,
                y: 16,
                duration: 0.48,
                ease: revealEase,
                overwrite: true,
            });
            gsap.to(title, {
                opacity: 0,
                y: 20,
                duration: 0.48,
                ease: revealEase,
                overwrite: true,
            });
            gsap.to(copy, {
                opacity: 0,
                y: 20,
                duration: 0.48,
                ease: revealEase,
                overwrite: true,
            });
            gsap.to(marker, Object.assign(Object.assign({}, inactiveMarker), { duration: 0.55, ease: revealEase, overwrite: true }));
            if (glow) {
                gsap.to(glow, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.4,
                    ease: revealEase,
                    overwrite: true,
                });
            }
        };
        (_a = appWindow.ScrollTrigger) === null || _a === void 0 ? void 0 : _a.create({
            trigger: step,
            start: "top 65%",
            end: "top -8%",
            onEnter: activateStep,
            onEnterBack: activateStep,
            onLeave: deactivateStep,
            onLeaveBack: deactivateStep,
        });
    });
    window.setTimeout(() => {
        var _a, _b;
        (_b = (_a = appWindow.ScrollTrigger) === null || _a === void 0 ? void 0 : _a.refresh) === null || _b === void 0 ? void 0 : _b.call(_a);
    }, 250);
};
const initContactForms = () => {
    const forms = queryAll("[data-contact-form]");
    forms.forEach((form) => {
        const submitButton = query("[data-form-submit]", form);
        const successMessage = query("[data-form-success]", form);
        const errorMessage = query("[data-form-error]", form);
        const setFeedback = (type, message) => {
            if (successMessage) {
                successMessage.hidden = type !== "success";
                successMessage.textContent = type === "success" ? message : "";
            }
            if (errorMessage) {
                errorMessage.hidden = type !== "error";
                errorMessage.textContent = type === "error" ? message : "";
            }
        };
        form.addEventListener("submit", (event) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            event.preventDefault();
            setFeedback("success", "");
            setFeedback("error", "");
            const fields = queryAll("input, textarea", form).filter((field) => field.type !== "hidden");
            const invalidField = fields.find((field) => {
                if (field.name === "website" && field.value.trim()) {
                    return true;
                }
                if (field.hasAttribute("required") && !field.value.trim()) {
                    return true;
                }
                if (field.type === "email" && field.value.trim()) {
                    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
                }
                return false;
            });
            if (invalidField) {
                invalidField.focus();
                setFeedback("error", "Please complete the required fields with valid information.");
                return;
            }
            const action = (_a = form.getAttribute("action")) !== null && _a !== void 0 ? _a : "";
            if (!action || action.includes("your-form-id")) {
                setFeedback("error", "Set your Formspree form ID in the form action before going live.");
                return;
            }
            submitButton === null || submitButton === void 0 ? void 0 : submitButton.setAttribute("disabled", "true");
            if (submitButton) {
                submitButton.textContent = "Sending...";
            }
            try {
                const formData = new FormData(form);
                const payload = {
                    name: String((_b = formData.get("name")) !== null && _b !== void 0 ? _b : ""),
                    organisation: String((_c = formData.get("organisation")) !== null && _c !== void 0 ? _c : ""),
                    email: String((_d = formData.get("email")) !== null && _d !== void 0 ? _d : ""),
                    phone: String((_e = formData.get("phone")) !== null && _e !== void 0 ? _e : ""),
                    area_of_interest: String((_g = (_f = formData.get("areaOfInterest")) !== null && _f !== void 0 ? _f : formData.get("area_of_interest")) !== null && _g !== void 0 ? _g : ""),
                    message: String((_h = formData.get("message")) !== null && _h !== void 0 ? _h : ""),
                    website: String((_j = formData.get("website")) !== null && _j !== void 0 ? _j : ""),
                };
                const response = yield fetch(action, {
                    method: "POST",
                    body: JSON.stringify(payload),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Submission failed");
                }
                form.reset();
                setFeedback("success", "Thank you for reaching out. We've received your enquiry and will be in touch shortly.");
            }
            catch (_k) {
                setFeedback("error", "Something went wrong. Please try again or email info@maseconsultinggroup.com directly.");
            }
            finally {
                submitButton === null || submitButton === void 0 ? void 0 : submitButton.removeAttribute("disabled");
                if (submitButton) {
                    submitButton.textContent = "Submit enquiry";
                }
            }
        }));
    });
};
const bootstrap = () => {
    console.log("[main.js] bootstrap running, readyState:", document.readyState);
    initDocumentState();
    initSkipLink();
    initNavigation();
    initServiceAccordion();
    initServicesDetail();
    initInteractiveGrid();
    initPrincipleIconLoops();
    initHeroImage();
    initContactForms();
    initEntrances();
    initGsapEnhancements();
    if (document.body.dataset.page === "industries" && window.location.hash) {
        const target = document.getElementById(window.location.hash.slice(1));
        if (target) {
            window.setTimeout(() => {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 120);
        }
    }
};
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
}
else {
    bootstrap();
}
