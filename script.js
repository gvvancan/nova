/**
 * AURA LANDING PAGE - JAVASCRIPT LOGIC
 * High-performance interactive behaviors, 3D tilt, counter animations,
 * form validation, modals, and responsive navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- 1. Ambient Cursor Glow ---
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }

    // --- 2. Sticky Header & Active Nav on Scroll ---
    const siteHeader = document.getElementById('siteHeader');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver for Section Active State in Nav
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // --- 3. Mobile Navigation Drawer ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        const toggleMenu = () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        };

        mobileToggle.addEventListener('click', toggleMenu);

        // Close menu on nav item click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });

        // Close on clicking outside menu
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('open') && 
                !navMenu.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                toggleMenu();
            }
        });
    }

    // --- 4. Animated Statistics Counter ---
    const statCards = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    const animateCounters = () => {
        statCards.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out expo for smooth finish
                const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const currentVal = easeOut * target;

                stat.textContent = isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal);

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = isDecimal ? target.toFixed(2) : target;
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedStats) {
                    hasAnimatedStats = true;
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsGrid);
    }

    // --- 5. 3D Tilt Effect on Feature Cards ---
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set mouse position for spotlight radial glow
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D rotation math
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -9;
            const rotateY = ((x - centerX) / centerX) * 9;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // --- 6. Feature Category Filter Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            featureCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // --- 7. FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('active', !isActive);
            questionBtn.setAttribute('aria-expanded', String(!isActive));
        });
    });

    // --- 8. Interactive Demo Modal ---
    const openDemoBtn = document.getElementById('openDemoBtn');
    const demoModal = document.getElementById('demoModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCtaBtn = document.getElementById('modalCtaBtn');

    const openModal = () => {
        if (demoModal) {
            demoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        if (demoModal) {
            demoModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (openDemoBtn) openDemoBtn.addEventListener('click', openModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCtaBtn) modalCtaBtn.addEventListener('click', closeModal);

    if (demoModal) {
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && demoModal && demoModal.classList.contains('active')) {
            closeModal();
        }
    });

    // --- 9. Toast Notification Handler ---
    const toast = document.getElementById('toastMessage');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    let toastTimeout;

    const showToast = (title, message, isSuccess = true) => {
        if (!toast) return;
        clearTimeout(toastTimeout);

        toastTitle.textContent = title;
        toastBody.textContent = message;
        toast.style.borderColor = isSuccess ? 'var(--primary)' : '#ef4444';

        const toastIcon = document.getElementById('toastIcon');
        if (toastIcon) {
            toastIcon.textContent = isSuccess ? '✓' : '!';
            toastIcon.style.background = isSuccess ? 'var(--primary)' : '#ef4444';
        }

        toast.classList.add('show');

        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
    };

    // --- 10. Contact Form Validation & Submission ---
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const messageInput = document.getElementById('userMessage');
    const submitBtn = document.getElementById('submitBtn');

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            // Name validation
            if (!nameInput.value.trim()) {
                nameInput.classList.add('invalid');
                isValid = false;
            } else {
                nameInput.classList.remove('invalid');
            }

            // Email validation
            if (!validateEmail(emailInput.value.trim())) {
                emailInput.classList.add('invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('invalid');
            }

            // Message validation
            if (messageInput.value.trim().length < 10) {
                messageInput.classList.add('invalid');
                isValid = false;
            } else {
                messageInput.classList.remove('invalid');
            }

            if (!isValid) return;

            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate server network request
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                contactForm.reset();

                showToast(
                    'შეტყობინება წარმატებით გაიგზავნა! 🎉',
                    'გმადლობთ, AURA-ს ექსპერტი 15 წუთში დაგიკავშირდებათ.',
                    true
                );
            }, 1200);
        });

        // Clear error on input typing
        [nameInput, emailInput, messageInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    input.classList.remove('invalid');
                });
            }
        });
    }

    // --- 11. Newsletter Form Handler ---
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');

    if (newsletterForm && newsletterEmail) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateEmail(newsletterEmail.value.trim())) {
                newsletterEmail.value = '';
                showToast(
                    'გამოწერილია! 🚀',
                    'თქვენ წარმატებით გამოიწერეთ AURA-ს სიახლეები.',
                    true
                );
            } else {
                showToast(
                    'შეცდომა',
                    'გთხოვთ მიუთითოთ სწორი ელ-ფოსტის მისამართი.',
                    false
                );
            }
        });
    }

});
