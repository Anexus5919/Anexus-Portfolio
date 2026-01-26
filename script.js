// ==========================================
// DOM Elements
// ==========================================
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('theme-toggle');
const skillItems = document.querySelectorAll('.skill-item');

// ==========================================
// Theme Toggle
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (!prefersDark) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme === 'dark' ? '' : 'light');
    localStorage.setItem('theme', newTheme);
}

// Initialize theme on page load
initTheme();

// Theme toggle event listener
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// ==========================================
// Navbar Scroll Effect
// ==========================================
function handleNavbarScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// ==========================================
// Mobile Menu Toggle
// ==========================================
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// Close mobile menu on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// ==========================================
// Smooth Scroll for Navigation Links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// Active Navigation Link on Scroll
// ==========================================
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// ==========================================
// Skill Bar Animation
// ==========================================
function animateSkillBars() {
    skillItems.forEach(item => {
        const progress = item.querySelector('.skill-progress');
        const level = item.dataset.level;
        if (progress && level) {
            progress.style.width = `${level}%`;
        }
    });
}

// ==========================================
// Intersection Observer for Animations
// ==========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Observer for skill bars
const skillsSection = document.querySelector('.skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { ...observerOptions, threshold: 0.2 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ==========================================
// Scroll Reveal Animation
// ==========================================
const revealElements = document.querySelectorAll(
    '.project-card, .timeline-item, .skill-category, .opensource-card, .contact-link, .education-card'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { ...observerOptions, threshold: 0.15 });

revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    revealObserver.observe(el);
});

// ==========================================
// Project Card Tilt Effect
// ==========================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ==========================================
// Hero Animation on Load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');

    // Animate hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }

    // Animate splash effects with slight delay
    const splashes = document.querySelectorAll('.splash');
    splashes.forEach((splash, index) => {
        splash.style.opacity = '0';
        splash.style.transform = 'scale(0.5)';

        setTimeout(() => {
            splash.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            splash.style.opacity = '';
            splash.style.transform = '';
        }, 300 + (index * 150));
    });
});

// ==========================================
// Parallax Effect for Splashes
// ==========================================
function handleSplashParallax() {
    const splashes = document.querySelectorAll('.splash');
    const scrolled = window.pageYOffset;

    if (window.innerWidth > 768 && scrolled < 800) {
        splashes.forEach((splash, index) => {
            const rate = (index + 1) * 0.05;
            splash.style.transform = `translateY(${scrolled * rate}px)`;
        });
    }
}

window.addEventListener('scroll', handleSplashParallax);

// ==========================================
// Console Easter Egg
// ==========================================
console.log('%c Adarsh Singh Portfolio ', 'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 20px; padding: 10px 20px; border-radius: 5px;');
console.log('%c Built with HTML, CSS & JavaScript ', 'color: #6366f1; font-size: 12px;');
console.log('%c Check out my GitHub: https://github.com/Anexus5919 ', 'color: #a855f7; font-size: 12px;');
