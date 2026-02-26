document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Preloader
    // ==========================================
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500); // 1.5 seconds loading simulation

    // ==========================================
    // Typed.js Auto-Typing Effect
    // ==========================================
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: ['مطور واجهات أمامية 💻', 'مصمم UI/UX 🎨', 'مطور مواقع ويب 🚀', 'مصمم جرافيك 🖌️'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    // ==========================================
    // Scroll Progress Bar
    // ==========================================
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = `${(totalScroll / windowHeight) * 100}%`;
        scrollProgress.style.width = scroll;
    });

    // ==========================================
    // Custom Interactive Cursor
    // ==========================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // animate the outline slightly delayed for smoothness
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add hover states to interactable elements
    const interactables = document.querySelectorAll('a, button, input, textarea, .project-card, .service-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
            cursorOutline.style.border = '1px solid rgba(79, 70, 229, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.border = '2px solid var(--primary-color)';
        });
    });

    // ==========================================
    // Initialize AOS (Animate On Scroll)
    // ==========================================
    AOS.init({
        once: true,
        offset: 100,
        duration: 800,
        easing: 'ease-out-cubic',
    });

    // ==========================================
    // Initialize Vanta.js 3D Background
    // ==========================================
    let vantaEffect = null;
    function initVanta(theme) {
        if (vantaEffect) vantaEffect.destroy();

        const isDark = theme === 'dark';

        // Use VANTA.NET for a cool interactive geometry pattern
        vantaEffect = VANTA.NET({
            el: "#hero",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: isDark ? 0x818cf8 : 0x4f46e5, // Primary Color nodes
            backgroundColor: isDark ? 0x0f172a : 0xf5f7fa, // Background Matches theme alt
            points: 12.00,
            maxDistance: 22.00,
            spacing: 18.00,
            showDots: true
        });
    }

    // ==========================================
    // Dark Mode Toggle
    // ==========================================
    const themeBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Check saved theme or system preference
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'dark' : 'light';
    }

    root.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // Start Vanta after a small delay to ensure container size is computed
    setTimeout(() => {
        initVanta(currentTheme);
    }, 100);

    themeBtn.addEventListener('click', () => {
        let theme = root.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';

        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        // Update Vanta Background Colors based on theme
        initVanta(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeBtn.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // ==========================================
    // Generate and Download CV as PDF
    // ==========================================
    const downloadCVBtns = [document.getElementById('hero-cv-btn'), document.getElementById('contact-cv-btn')];

    downloadCVBtns.forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Show loading state
            const originalText = btn.innerHTML;
            btn.innerHTML = 'جاري التحضير... <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;

            const cvTemplate = document.getElementById('cv-content');

            const opt = {
                margin: 10, // 10mm margin
                filename: 'Nour_Nady_Saber_CV.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 3, useCORS: true, letterRendering: true }, // Higher scale for better definition
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Wait a tiny bit so the UI has time to update to the loading state
            setTimeout(() => {
                html2pdf().set(opt).from(cvTemplate).save().then(() => {
                    // Restore button state
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }).catch(err => {
                    console.error("Error generating PDF:", err);
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    alert("حدث خطأ أثناء تحميل السيرة الذاتية.");
                });
            }, 100);
        });
    });

    // ==========================================
    // Mobile Menu Toggle
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const toggleIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            toggleIcon.classList.remove('fa-bars');
            toggleIcon.classList.add('fa-xmark');
        } else {
            toggleIcon.classList.remove('fa-xmark');
            toggleIcon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            toggleIcon.classList.remove('fa-xmark');
            toggleIcon.classList.add('fa-bars');
        });
    });

    // ==========================================
    // Smooth Scrolling for anchor links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // Navbar visual change on scroll
    // ==========================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            if (root.getAttribute('data-theme') === 'dark') {
                navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
            } else {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
        } else {
            navbar.style.boxShadow = 'none';
            if (root.getAttribute('data-theme') === 'dark') {
                navbar.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
            } else {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            }
        }
    });

});
