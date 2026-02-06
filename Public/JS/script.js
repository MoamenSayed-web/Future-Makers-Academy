// ============================================
// ENHANCED JAVASCRIPT WITH ANIMATIONS
// ============================================

(function () {
    'use strict';

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Smooth scroll to element
     */
    function smoothScroll(target) {
        if (typeof target === 'string') {
            target = document.querySelector(target);
        }
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Add class with animation
     */
    function animateElement(el, className, duration = 600) {
        return new Promise((resolve) => {
            el.classList.add(className);
            setTimeout(() => {
                el.classList.remove(className);
                resolve();
            }, duration);
        });
    }

    /**
     * Debounce function for better performance
     */
    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * Throttle function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Email validation
     */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ========== HEADER & NAVIGATION ==========

    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('mainNav');
    const headerBtns = document.querySelector('.header-buttons');
    const current = JSON.parse(localStorage.getItem('fma_current_user') || 'null');

    // Mobile menu toggle with smooth animation
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            const isOpen = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!isOpen));
            this.classList.toggle('active');
            mainNav.classList.toggle('open');

            // Smooth height animation
            if (!isOpen) {
                mainNav.style.maxHeight = mainNav.scrollHeight + 'px';
            } else {
                mainNav.style.maxHeight = '0';
            }
        });

        // Close menu when nav link clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                // Smooth scroll to target
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    smoothScroll(targetElement);
                    
                    // Add pulse animation
                    targetElement.style.animation = 'none';
                    setTimeout(() => {
                        targetElement.style.animation = 'pulse 0.6s ease';
                    }, 10);
                }
                
                // Close menu on mobile
                if (mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mainNav.style.maxHeight = '0';
                }
            });
        });

        // Highlight active nav link on scroll
        window.addEventListener('scroll', throttle(function () {
            const sections = document.querySelectorAll('.section-divider, #home, #services, #why-choose, #stats, #testimonials, #faq, #learning-path, #offer, #about, #contact');
            const navLinks = mainNav.querySelectorAll('a');

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }, 100));
    }

    // Update header buttons based on login state
    if (current && headerBtns) {
        headerBtns.innerHTML = `
            <span style="margin-right:12px;font-weight:600;color:var(--text-secondary);">
                Welcome, ${current.name || current.email}
            </span>
            <a href="dashboard.html" class="btn btn-outline-primary"><span class="btn-text">Dashboard</span></a>
            <button id="logoutBtn" class="btn btn-primary"><span class="btn-text">Logout</span></button>
        `;

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                animateElement(document.body, 'fadeOut', 300).then(() => {
                    localStorage.removeItem('fma_current_user');
                    sessionStorage.removeItem('fma_just_logged_in');
                    location.reload();
                });
            });
        }
    }

    // Welcome toast
    if (sessionStorage.getItem('fma_just_logged_in')) {
        sessionStorage.removeItem('fma_just_logged_in');
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Welcome back, ${current ? (current.name || '') : ''}!`,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            });
        }
    }

    // ========== TRACK CARD INTERACTIONS ==========

    document.querySelectorAll('.view-track').forEach(btn => {
        btn.addEventListener('click', async function () {
            const currentUser = JSON.parse(localStorage.getItem('fma_current_user') || 'null');
            const track = this.dataset.track || 'Track';

            // Add loading animation
            await animateElement(this, 'pulse', 300);

            if (!currentUser) {
                if (typeof Swal !== 'undefined') {
                    const result = await Swal.fire({
                        title: 'Join to Access This Track',
                        text: 'You need an account to view the full track. Sign up or login?',
                        icon: 'info',
                        showCancelButton: true,
                        confirmButtonText: 'Sign Up',
                        cancelButtonText: 'Login',
                        backdrop: 'rgba(0, 0, 0, 0.5)',
                        customClass: {
                            container: 'swal-custom'
                        }
                    });
                    if (result.isConfirmed) window.location = 'register.html';
                    else if (result.dismiss === Swal.DismissReason.cancel) window.location = 'login.html';
                }
                return;
            }

            if (typeof Swal !== 'undefined') {
                const result = await Swal.fire({
                    title: track,
                    html: `<p style="color: var(--text-secondary);">Welcome <strong style="color: var(--primary-color);">${currentUser.name || ''}</strong>! This track includes lessons, hands-on projects, and a certificate on completion.</p>`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Go to Dashboard',
                    cancelButtonText: 'Close',
                    backdrop: 'rgba(0, 0, 0, 0.5)'
                });
                if (result.isConfirmed) window.location = 'dashboard.html';
            }
        });
    });

    // ========== CONTACT FORM ==========

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const contactBtn = document.getElementById('contactBtn');
        const nameField = document.getElementById('contact_name');
        const emailField = document.getElementById('contact_email');
        const subjectField = document.getElementById('contact_subject');
        const msgField = document.getElementById('contact_message');
        const nameError = document.getElementById('contactNameError');
        const emailError = document.getElementById('contactEmailError');
        const msgError = document.getElementById('contactMsgError');

        // Prefill form if logged in
        const currentUser = JSON.parse(localStorage.getItem('fma_current_user') || 'null');
        if (currentUser) {
            if (currentUser.name) nameField.value = currentUser.name;
            if (currentUser.email) emailField.value = currentUser.email;
        }

        // Clear errors helper
        function clearErrors() {
            [nameField, emailField, msgField].forEach(f => {
                f.classList.remove('invalid');
            });
            [nameError, emailError, msgError].forEach(d => {
                if (d) d.textContent = '';
            });
        }

        // Form submission with validation
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            clearErrors();

            let isValid = true;
            const errors = {};

            // Validation logic
            if (!nameField.value.trim()) {
                errors.name = 'Please enter your name';
                nameField.classList.add('invalid');
                isValid = false;
            }
            if (!isValidEmail(emailField.value)) {
                errors.email = 'Enter a valid email';
                emailField.classList.add('invalid');
                isValid = false;
            }
            if (msgField.value.trim().length < 10) {
                errors.message = 'Message must be at least 10 characters';
                msgField.classList.add('invalid');
                isValid = false;
            }

            if (!isValid) {
                if (nameError && errors.name) nameError.textContent = errors.name;
                if (emailError && errors.email) emailError.textContent = errors.email;
                if (msgError && errors.message) msgError.textContent = errors.message;

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Form Error',
                        text: 'Please complete the form correctly',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
                const firstInvalid = document.querySelector('.invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Submit animation
            contactBtn.disabled = true;
            contactBtn.classList.add('loading');

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1200));

            contactBtn.disabled = false;
            contactBtn.classList.remove('loading');

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent!',
                    text: 'Thank you — we will reply within 24 hours.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2500
                });
            }

            // Reset form
            contactForm.reset();
            if (currentUser) {
                nameField.value = currentUser.name || '';
                emailField.value = currentUser.email || '';
            }
        });
    }

    // ========== LOGIN PAGE ==========

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const loginBtn = document.getElementById('loginBtn');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const passwordToggles = document.querySelectorAll('.pass-toggle');

        // Password visibility toggle
        passwordToggles.forEach(btn => {
            btn.addEventListener('click', function () {
                const input = this.parentElement.querySelector('input');
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                this.textContent = isPassword ? 'Hide' : 'Show';
                this.style.color = isPassword ? 'var(--secondary-color)' : 'var(--text-secondary)';
            });
        });

        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Clear previous errors
            [emailInput, passwordInput].forEach(f => f.classList.remove('invalid'));
            emailInput.parentElement.parentElement.querySelector('.form-error').textContent = '';
            passwordInput.parentElement.parentElement.querySelector('.form-error').textContent = '';

            let isValid = true;

            if (!isValidEmail(emailInput.value)) {
                emailInput.classList.add('invalid');
                emailInput.parentElement.parentElement.querySelector('.form-error').textContent = 'Enter a valid email';
                isValid = false;
            }

            if (passwordInput.value.length < 1) {
                passwordInput.classList.add('invalid');
                passwordInput.parentElement.parentElement.querySelector('.form-error').textContent = 'Enter your password';
                isValid = false;
            }

            if (!isValid) return;

            // Loading state
            loginBtn.disabled = true;
            loginBtn.classList.add('loading');

            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check credentials
            const users = JSON.parse(localStorage.getItem('fma_users') || '[]');
            const user = users.find(u => u.email === emailInput.value.trim().toLowerCase());

            if (!user || user.password !== btoa(passwordInput.value)) {
                loginBtn.disabled = false;
                loginBtn.classList.remove('loading');
                passwordInput.classList.add('invalid');
                passwordInput.parentElement.parentElement.querySelector('.form-error').textContent = 'Invalid email or password';

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Invalid email or password',
                        backdrop: 'rgba(0, 0, 0, 0.5)'
                    });
                }
                return;
            }

            localStorage.setItem('fma_current_user', JSON.stringify({ name: user.name, email: user.email }));
            sessionStorage.setItem('fma_just_logged_in', '1');

            if (typeof Swal !== 'undefined') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: `Welcome back, ${user.name}!`,
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: 'rgba(0, 0, 0, 0.5)'
                });
            }

            window.location = 'index.html';
        });
    }

    // ========== REGISTER PAGE ==========

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const registerBtn = document.getElementById('registerBtn');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirm');

        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Clear errors
            [nameInput, emailInput, passwordInput, confirmInput].forEach(f => {
                f.classList.remove('invalid');
                const error = f.parentElement.parentElement.querySelector('.form-error');
                if (error) error.textContent = '';
            });

            let isValid = true;

            // Validation
            if (nameInput.value.trim().length < 2) {
                nameInput.classList.add('invalid');
                nameInput.parentElement.parentElement.querySelector('.form-error').textContent = 'Enter your full name';
                isValid = false;
            }

            if (!isValidEmail(emailInput.value)) {
                emailInput.classList.add('invalid');
                emailInput.parentElement.parentElement.querySelector('.form-error').textContent = 'Enter a valid email';
                isValid = false;
            }

            if (passwordInput.value.length < 8) {
                passwordInput.classList.add('invalid');
                passwordInput.parentElement.parentElement.querySelector('.form-error').textContent = 'Password should be at least 8 characters';
                isValid = false;
            }

            if (passwordInput.value !== confirmInput.value) {
                confirmInput.classList.add('invalid');
                confirmInput.parentElement.parentElement.querySelector('.form-error').textContent = 'Passwords do not match';
                isValid = false;
            }

            if (!isValid) return;

            // Check if email exists
            const users = JSON.parse(localStorage.getItem('fma_users') || '[]');
            if (users.find(u => u.email === emailInput.value.trim().toLowerCase())) {
                emailInput.classList.add('invalid');
                emailInput.parentElement.parentElement.querySelector('.form-error').textContent = 'Email already registered';
                return;
            }

            // Loading
            registerBtn.disabled = true;
            registerBtn.classList.add('loading');

            await new Promise(resolve => setTimeout(resolve, 1200));

            // Save user
            users.push({
                name: nameInput.value,
                email: emailInput.value.trim().toLowerCase(),
                password: btoa(passwordInput.value)
            });
            localStorage.setItem('fma_users', JSON.stringify(users));
            localStorage.setItem('fma_current_user', JSON.stringify({
                name: nameInput.value,
                email: emailInput.value.trim().toLowerCase()
            }));

            if (typeof Swal !== 'undefined') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    text: `Welcome to Future Makers Academy, ${nameInput.value}!`,
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: 'rgba(0, 0, 0, 0.5)'
                });
            }

            window.location = 'index.html';
        });
    }

    // ========== DASHBOARD PAGE ==========

    const headerBtnsHeader = document.getElementById('headerBtns');
    if (headerBtnsHeader && window.location.pathname.includes('dashboard')) {
        const currentUser = JSON.parse(localStorage.getItem('fma_current_user') || 'null');

        if (!currentUser) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'info',
                    title: 'Please Log In',
                    text: 'You must sign in to view your dashboard'
                }).then(() => {
                    window.location = 'login.html';
                });
            } else {
                setTimeout(() => { window.location = 'login.html'; }, 1000);
            }
            return;
        }

        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');

        if (userName) userName.textContent = currentUser.name || currentUser.email;
        if (userEmail) userEmail.textContent = currentUser.email;

        headerBtnsHeader.innerHTML = `
            <span style="margin-right:12px;font-weight:600;color:var(--text-secondary);">
                ${currentUser.name || currentUser.email}
            </span>
            <a href="index.html" class="btn btn-outline-primary"><span class="btn-text">Home</span></a>
            <button id="logoutBtnHeader" class="btn btn-primary"><span class="btn-text">Logout</span></button>
        `;

        function doLogout() {
            animateElement(document.body, 'fadeOut', 300).then(() => {
                localStorage.removeItem('fma_current_user');
                sessionStorage.removeItem('fma_just_logged_in');
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Logged Out',
                        showConfirmButton: false,
                        timer: 1200
                    }).then(() => {
                        window.location = 'index.html';
                    });
                } else {
                    window.location = 'index.html';
                }
            });
        }

        const logoutBtn = document.getElementById('logoutBtn');
        const logoutBtnHeader = document.getElementById('logoutBtnHeader');

        if (logoutBtn) logoutBtn.addEventListener('click', doLogout);
        if (logoutBtnHeader) logoutBtnHeader.addEventListener('click', doLogout);

        // Handle course actions
        document.querySelectorAll('[data-action="open-course"]').forEach(btn => {
            btn.addEventListener('click', async function () {
                await animateElement(this, 'pulse', 300);
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'info',
                        title: 'Course Coming Soon',
                        text: 'This feature will be available soon!',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
        });
    }

    // ========== SCROLL ANIMATIONS ==========

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.track-card, .about-section, .contact-section').forEach(el => {
        observer.observe(el);
    });

    // ========== PARALLAX EFFECT ==========

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', throttle(() => {
            parallaxElements.forEach(el => {
                const scrollPos = window.scrollY;
                const speed = el.dataset.parallax || 0.5;
                el.style.transform = `translateY(${scrollPos * speed}px)`;
            });
        }, 16));
    }

    // ========== SMOOTH PAGE TRANSITIONS ==========

    document.querySelectorAll('a[href^="./"], a[href^="../"]').forEach(link => {
        if (!link.target || link.target !== '_blank') {
            link.addEventListener('click', function (e) {
                if (this.href && !this.href.includes('#')) {
                    e.preventDefault();
                    const href = this.href;
                    animateElement(document.body, 'fadeOut', 300).then(() => {
                        window.location = href;
                    });
                }
            });
        }
    });

    // ========== ACCESSIBILITY ==========

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openMenu = document.querySelector('.links.open');
            if (openMenu) {
                openMenu.classList.remove('open');
                menuToggle?.classList.remove('active');
                menuToggle?.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // ========== PREFERS REDUCED MOTION ==========

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.scrollBehavior = 'auto';
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }

    console.log('%c🚀 Future Makers Academy Loaded!', 'color: #00d4ff; font-size: 14px; font-weight: bold;');

    // ========== FAQ ACCORDION ==========

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', function () {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });

})();
