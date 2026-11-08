/* ================
   MAIN.JS
   Concept Design - Premium Architecture Website
   ================ */

'use strict';

// === UTILITY FUNCTIONS ===
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// === NAVBAR SCROLL EFFECT ===
const navbar = $('#navbar');
const scrollTopBtn = $('#scroll-top');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar
    if (scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll to top button
    if (scrollY > 400) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}, { passive: true });

scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// === HAMBURGER MENU ===
const hamburger = $('#hamburger');
const navLinks = $('#nav-links');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close menu on link click
$$('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    }
});

// === SMOOTH SCROLL FOR NAV LINKS ===
$$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
});

// === AOS - SCROLL ANIMATIONS ===
function initAOS() {
    const aosElements = $$('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    aosElements.forEach(el => observer.observe(el));
}

// === COUNTER ANIMATION ===
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2200;
    const startTime = performance.now();
    const startVal = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startVal + (target - startVal) * ease);
        el.textContent = current;
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

function initCounters() {
    const counters = $$('.stat-num[data-target]');
    const bars = $$('.stat-bar-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate number counters
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                // Animate progress bars
                setTimeout(() => {
                    bars.forEach(bar => bar.classList.add('animated'));
                }, 300);
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const statsSection = $('#stats');
    if (statsSection) observer.observe(statsSection);
}

// === PORTFOLIO FILTER ===
function initPortfolioFilter() {
    const filterBtns = $$('.filter-btn');
    const portfolioItems = $$('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            portfolioItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => { item.style.display = 'none'; }, 400);
                }
            });
        });
    });
}

// === LIGHTBOX ===
function initLightbox() {
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightbox-img');
    const lightboxClose = $('#lightbox-close');
    const lightboxOverlay = lightbox?.querySelector('.lightbox-overlay');

    $$('.portfolio-view').forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const portfolioImg = btn.closest('.portfolio-img')?.querySelector('img');
            if (portfolioImg && lightboxImg && lightbox) {
                lightboxImg.src = portfolioImg.src;
                lightboxImg.alt = portfolioImg.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Also open lightbox on portfolio item click
    $$('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img && lightboxImg && lightbox) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox?.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxOverlay?.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

// === CONTACT FORM ===
function initContactForm() {
    const form = $('#contact-form');
    const submitBtn = $('#submit-btn');
    const successMsg = $('#form-success');

    form?.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple validation
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !message) {
            // Shake animation on empty fields
            [form.querySelector('#name'), form.querySelector('#email'), form.querySelector('#message')].forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    field.style.animation = 'shake 0.4s ease';
                    setTimeout(() => {
                        field.style.borderColor = '';
                        field.style.animation = '';
                    }, 1000);
                }
            });
            return;
        }

        // Submit simulation
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري الإرسال...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = '<span>إرسال الرسالة</span> <i class="fas fa-paper-plane"></i>';
            submitBtn.disabled = false;
            successMsg.classList.add('show');
            setTimeout(() => successMsg.classList.remove('show'), 5000);
        }, 1800);
    });
}

// === NAVBAR ACTIVE LINK HIGHLIGHTING ===
function initActiveNavLink() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-links a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => observer.observe(section));
}

// === PARALLAX HERO ===
function initParallax() {
    const heroBg = $('.hero-bg img');
    if (!heroBg) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
        }
    }, { passive: true });
}

// === GLOWING LINES ANIMATION ===
function initGlowingEffect() {
    const gridLines = $$('.grid-line');
    gridLines.forEach((line, i) => {
        line.style.animationDelay = `${i * 0.3}s`;
    });
}

// === SERVICE CARDS - Tilt Effect ===
function initTiltEffect() {
    $$('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-8px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
        });
    });
}

// === CSS SHAKE ANIMATION (injected) ===
function addShakeAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
        }
        .nav-links a.active { color: var(--gold) !important; }
        .nav-links a.active::after { transform: scaleX(1) !important; }
    `;
    document.head.appendChild(style);
}

// === INITIALIZE ALL ===
document.addEventListener('DOMContentLoaded', () => {
    addShakeAnimation();
    initAOS();
    initCounters();
    initPortfolioFilter();
    initLightbox();
    initContactForm();
    initActiveNavLink();
    initParallax();
    initGlowingEffect();
    initTiltEffect();

    // Initial scroll check
    window.dispatchEvent(new Event('scroll'));

    console.log('%c🏛️ Concept Design Website', 'color: #c9a96e; font-size: 18px; font-weight: bold;');
    console.log('%cPowered by Premium Architecture Design', 'color: #888; font-size: 12px;');
});
