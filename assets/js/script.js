/*
============================================================
Bernina Moot Premium Website JavaScript
============================================================
Shared interactions for the multi-page website:
1. Sticky header state on scroll
2. Mobile navigation open/close behavior
3. Current page navigation highlighting
4. Refined rotating hero word effect
5. WhatsApp preview panel interaction
6. Scroll reveal animations
7. Back-to-top button visibility and behavior
8. Automatic current year in the footer
============================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const header = document.querySelector(".site-header");
    const navToggle = document.querySelector(".nav-toggle");
    const navPanel = document.querySelector(".nav-panel");
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const typedWord = document.querySelector(".typed-word");
    const floatingWhatsappIcon = document.querySelector(".floating-whatsapp__icon");
    const floatingWhatsapp = document.querySelector(".floating-whatsapp");
    const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
    const backToTopButton = document.querySelector(".back-to-top");
    const currentYear = document.querySelector("#currentYear");
    const priceTabsRoot = document.querySelector("[data-price-tabs]");
    const classPriceImageButtons = Array.from(document.querySelectorAll("[data-class-price-image]"));
    const mobileNavBreakpoint = window.matchMedia("(max-width: 1120px)");
    const whatsappIconMarkup = `
        <svg viewBox="0 0 24 24" role="presentation">
            <path
                d="
                    M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .17 5.32.17 11.88
                    c0 2.09.54 4.13 1.57 5.93L0 24l6.35-1.66a11.8 11.8 0 0 0 5.69 1.45h.01
                    c6.55 0 11.88-5.33 11.88-11.89 0-3.17-1.24-6.15-3.41-8.42zm-8.48 18.3h-.01
                    a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.77.99 1-3.68-.24-.38a9.86 9.86 0 0 1-1.51-5.26
                    c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.98 2.9a9.83 9.83 0 0 1 2.9 6.99
                    c0 5.46-4.44 9.9-9.89 9.9zm5.43-7.41c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15
                    s-.77.97-.94 1.17c-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.74-1.65-2.03
                    -.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52
                    -.08-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.08-.8.37
                    s-1.05 1.03-1.05 2.5c0 1.47 1.08 2.89 1.23 3.09.15.2 2.12 3.23 5.13 4.53
                    .72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42
                    .25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35z
                "
                fill="currentColor"
            ></path>
        </svg>
    `;

    if (floatingWhatsappIcon) {
        floatingWhatsappIcon.innerHTML = whatsappIconMarkup;
    }

    const closeMobileMenu = () => {
        if (!navToggle || !navPanel) return;
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
        navPanel.classList.remove("is-open");
        body.classList.remove("menu-open");
    };

    const openMobileMenu = () => {
        if (!navToggle || !navPanel) return;
        navToggle.classList.add("is-active");
        navToggle.setAttribute("aria-expanded", "true");
        navPanel.classList.add("is-open");
        body.classList.add("menu-open");
    };

    const setHeaderState = () => {
        if (!header) return;
        header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    const setActiveNavLink = () => {
        if (!navLinks.length) return;

        const currentPath = window.location.pathname.split("/").pop() || "index.html";
        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === currentPath);
        });
    };

    if (navToggle) {
        navToggle.addEventListener("click", () => {
            const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
            if (isExpanded) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (!navPanel || !navToggle) return;

        const clickedInsideMenu = navPanel.contains(event.target);
        const clickedToggle = navToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMobileMenu();
        }
    });

    const handleScrollUI = () => {
        setHeaderState();
        if (backToTopButton) {
            backToTopButton.classList.toggle("is-visible", window.scrollY > 420);
        }
    };

    let isScrollTicking = false;
    const requestScrollUIUpdate = () => {
        if (isScrollTicking) return;
        isScrollTicking = true;
        window.requestAnimationFrame(() => {
            handleScrollUI();
            isScrollTicking = false;
        });
    };

    window.addEventListener("scroll", requestScrollUIUpdate, { passive: true });
    window.addEventListener("resize", () => {
        if (!mobileNavBreakpoint.matches) {
            closeMobileMenu();
        }
        requestScrollUIUpdate();
    });
    handleScrollUI();
    setActiveNavLink();

    if (priceTabsRoot) {
        const priceTabButtons = Array.from(document.querySelectorAll("[data-price-tab-trigger]"));
        const pricePanels = Array.from(priceTabsRoot.querySelectorAll("[data-price-panel]"));
        const activatePriceTab = (targetTab, shouldScroll = false) => {
            priceTabButtons.forEach((button) => {
                const isTarget = button.dataset.priceTabTrigger === targetTab;
                if (button.classList.contains("pricing-tab")) {
                    button.classList.toggle("is-active", isTarget);
                    button.setAttribute("aria-selected", String(isTarget));
                }
            });

            pricePanels.forEach((panel) => {
                const isTarget = panel.dataset.pricePanel === targetTab;
                panel.hidden = !isTarget;
                panel.classList.toggle("is-active", isTarget);
            });

            if (shouldScroll) {
                priceTabsRoot.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        };

        priceTabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                activatePriceTab(button.dataset.priceTabTrigger, !button.classList.contains("pricing-tab"));
            });
        });
    }

    if (classPriceImageButtons.length) {
        let activeClassImageTrigger = null;
        let classImageZoom = 1;

        const lightbox = document.createElement("div");
        lightbox.className = "class-image-lightbox";
        lightbox.setAttribute("aria-hidden", "true");
        lightbox.innerHTML = `
            <div class="class-image-lightbox__shell" role="dialog" aria-modal="true" aria-label="Class price sheet preview">
                <div class="class-image-lightbox__toolbar">
                    <button class="class-image-lightbox__button" type="button" data-class-image-zoom-out aria-label="Zoom out">-</button>
                    <button class="class-image-lightbox__button" type="button" data-class-image-zoom-in aria-label="Zoom in">+</button>
                    <button class="class-image-lightbox__button" type="button" data-class-image-close aria-label="Close preview">X</button>
                </div>
                <div class="class-image-lightbox__viewport">
                    <img class="class-image-lightbox__image" src="" alt="">
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector(".class-image-lightbox__image");
        const closeButton = lightbox.querySelector("[data-class-image-close]");
        const zoomInButton = lightbox.querySelector("[data-class-image-zoom-in]");
        const zoomOutButton = lightbox.querySelector("[data-class-image-zoom-out]");

        const setClassImageZoom = (nextZoom) => {
            classImageZoom = Math.min(Math.max(nextZoom, 1), 2.4);
            if (!lightboxImage) return;

            if (classImageZoom === 1) {
                lightboxImage.style.width = "";
                lightboxImage.style.maxWidth = "";
                lightboxImage.style.maxHeight = "";
                lightboxImage.style.transform = "";
                return;
            }

            lightboxImage.style.width = `${Math.round(classImageZoom * 100)}%`;
            lightboxImage.style.maxWidth = "none";
            lightboxImage.style.maxHeight = "none";
            lightboxImage.style.transform = "none";
        };

        const closeClassImageLightbox = () => {
            lightbox.classList.remove("is-open");
            lightbox.setAttribute("aria-hidden", "true");
            body.classList.remove("lightbox-open");
            setClassImageZoom(1);
            if (activeClassImageTrigger) {
                activeClassImageTrigger.focus();
            }
        };

        const openClassImageLightbox = (trigger) => {
            if (!lightboxImage) return;
            activeClassImageTrigger = trigger;
            lightboxImage.src = trigger.dataset.classPriceImage;
            lightboxImage.alt = trigger.dataset.classPriceAlt || "Class price sheet";
            setClassImageZoom(1);
            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");
            body.classList.add("lightbox-open");
            closeButton?.focus();
        };

        classPriceImageButtons.forEach((trigger) => {
            trigger.addEventListener("click", () => {
                openClassImageLightbox(trigger);
            });

            trigger.addEventListener("keydown", (event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                openClassImageLightbox(trigger);
            });
        });

        zoomInButton?.addEventListener("click", () => {
            setClassImageZoom(classImageZoom + 0.35);
        });

        zoomOutButton?.addEventListener("click", () => {
            setClassImageZoom(classImageZoom - 0.35);
        });

        closeButton?.addEventListener("click", closeClassImageLightbox);

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeClassImageLightbox();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
                closeClassImageLightbox();
            }
        });
    }

    if (backToTopButton) {
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    if (typedWord) {
        const words = (typedWord.dataset.words || "")
            .split(",")
            .map((word) => word.trim())
            .filter(Boolean);

        let currentIndex = 0;

        if (words.length > 1) {
            window.setInterval(() => {
                currentIndex = (currentIndex + 1) % words.length;
                typedWord.style.opacity = "0";
                typedWord.style.filter = "blur(5px)";

                window.setTimeout(() => {
                    typedWord.textContent = words[currentIndex];
                    typedWord.style.opacity = "1";
                    typedWord.style.filter = "blur(0)";
                }, 180);
            }, 2400);
        }
    }

    if (floatingWhatsapp) {
        const preview = document.createElement("div");
        preview.className = "whatsapp-preview";
        preview.setAttribute("aria-hidden", "true");
        preview.innerHTML = `
            <div class="whatsapp-preview__header">
                <span class="whatsapp-preview__badge" aria-hidden="true">
                    ${whatsappIconMarkup}
                </span>
                <div>
                    <strong>Bernina Moot</strong>
                    <span>Ready to assist on WhatsApp</span>
                </div>
                <button
                    class="button button--secondary whatsapp-preview__close"
                    type="button"
                    data-whatsapp-close
                    aria-label="Close WhatsApp preview"
                >
                    X
                </button>
            </div>
            <div class="whatsapp-preview__bubble">
                Hello Bernina Moot, I would like to enquire about your machines / services.
            </div>
            <div class="whatsapp-preview__actions">
                <a
                    class="button button--primary whatsapp-preview__open"
                    href="${floatingWhatsapp.getAttribute("href")}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Continue
                </a>
            </div>
        `;
        document.body.appendChild(preview);

        const closePreview = () => {
            preview.classList.remove("is-visible");
            preview.setAttribute("aria-hidden", "true");
        };

        const openPreview = () => {
            preview.classList.add("is-visible");
            preview.setAttribute("aria-hidden", "false");
        };

        floatingWhatsapp.addEventListener("click", (event) => {
            event.preventDefault();
            if (preview.classList.contains("is-visible")) {
                closePreview();
            } else {
                openPreview();
            }
        });

        preview.querySelector("[data-whatsapp-close]")?.addEventListener("click", () => {
            closePreview();
        });

        document.addEventListener("click", (event) => {
            const clickedPreview = preview.contains(event.target);
            const clickedLauncher = floatingWhatsapp.contains(event.target);
            if (!clickedPreview && !clickedLauncher) {
                closePreview();
            }
        });
    }

    if (revealItems.length) {
        const sectionRevealItems = revealItems.filter((item) => item.dataset.reveal === "section");
        const standaloneRevealItems = revealItems.filter((item) => {
            if (item.dataset.reveal === "section") return false;
            return !item.closest('[data-reveal="section"]');
        });

        const revealElement = (element, delay = 0) => {
            element.style.transitionDelay = `${delay}ms`;
            element.classList.add("is-visible");
        };

        const revealSectionChildren = (section) => {
            const sectionChildren = Array.from(section.querySelectorAll("[data-reveal]")).filter(
                (item) => item !== section && item.closest('[data-reveal="section"]') === section
            );

            sectionChildren.forEach((item, index) => {
                revealElement(item, Math.min(120 + index * 70, 420));
            });
        };

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    revealElement(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.16,
                rootMargin: "0px 0px -12% 0px"
            }
        );

        const sectionObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    revealElement(entry.target);
                    revealSectionChildren(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -8% 0px"
            }
        );

        standaloneRevealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index * 55, 220)}ms`;
            revealObserver.observe(item);
        });

        sectionRevealItems.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }
});
