document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================
       1. TEXT SCRAMBLE HACKER EFFECT
       ========================================== */
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#_01011';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="opacity-50">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    /* ==========================================
       2. BOOT SEQUENCE & HERO REVEAL
       ========================================== */
    const bootLog = document.getElementById('boot-log');
    const bootOverlay = document.getElementById('boot-screen');
    const titleContainer = document.getElementById('massive-title');
    const titleText = "IPSUM";
    
    // Setup title letters
    titleContainer.innerHTML = titleText.split('').map(char => `<span class="hero-letter inline-block drop-shadow-[4px_4px_0_rgba(229,109,177,0.8)]">${char}</span>`).join('');

    const bootLines = [
        '> IPSUM KERNEL v3.8.5', 
        '> ESTABELECENDO LIGAÇÃO NEURAL...', 
        '> BYPASS FIREWALL... [SUCESSO]', 
        '> BEM VINDO, OPERADOR.'
    ];
    let lineIdx = 0;

    const runBoot = () => {
        if (lineIdx < bootLines.length) {
            const p = document.createElement('div');
            bootLog.appendChild(p);
            anime({
                targets: p,
                innerHTML: [0, bootLines[lineIdx]],
                duration: 150,
                easing: 'linear',
                complete: () => {
                    lineIdx++;
                    setTimeout(runBoot, 100);
                }
            });
        } else {
            setTimeout(() => {
                anime({
                    targets: bootOverlay, 
                    opacity: 0, 
                    scale: 1.05,
                    duration: 600, 
                    easing: 'easeInOutExpo',
                    complete: () => {
                        bootOverlay.style.display = 'none';
                        startHeroAnimations();
                    }
                });
            }, 400);
        }
    };
    
    if(!prefersReducedMotion) runBoot();
    else { bootOverlay.style.display = 'none'; startHeroAnimations(); }

    const startHeroAnimations = () => {
        // Navbar drop
        anime({ targets: '#navbar', translateY: ['-100%', 0], opacity: [0, 1], duration: 1000, easing: 'easeOutExpo' });
        
        // Letters stagger (Elástico)
        anime({ 
            targets: '.hero-letter', 
            translateY: [-100, 0], 
            opacity: [0, 1], 
            rotateX: [-90, 0],
            delay: anime.stagger(150),
            duration: 1200, 
            easing: 'easeOutElastic(1, .6)' 
        });

        // Rest of hero content
        anime({ targets: '#hero-content p, #hero-content div.flex', translateY: [40, 0], opacity: [0, 1], delay: 600, duration: 1000, easing: 'easeOutExpo' });

        // Animate Geometry background infinitely
        anime({
            targets: '.hero-shape',
            scale: [1, 1.2],
            rotate: '1turn',
            duration: 15000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
        });
        anime({
            targets: '.hero-ring',
            rotate: '1turn',
            duration: 30000,
            loop: true,
            easing: 'linear'
        });
        anime({
            targets: '.hero-ring-inner',
            rotate: '-1turn',
            scale: [1, 1.1, 1],
            duration: 20000,
            loop: true,
            easing: 'linear'
        });
    };

    /* ==========================================
       3. SMART NAVBAR & LENIS SCROLL
       ========================================== */
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1.2 });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    // Para o scroll horizontal
    const track = document.getElementById('protocols-track');
    const wrapper = document.getElementById('gameplay');
    
    lenis.on('scroll', (e) => {
        const scrollY = e.animatedScroll;
        const isDesktop = window.innerWidth >= 768;

        // --- Smart Navbar Logic ---
        if (scrollY > 150) {
            if (scrollY > lastScrollY && !navbar.classList.contains('nav-hidden')) {
                navbar.classList.add('nav-hidden'); // Hide on scroll down
            } else if (scrollY < lastScrollY && navbar.classList.contains('nav-hidden')) {
                navbar.classList.remove('nav-hidden'); // Show on scroll up
            }
        } else {
            navbar.classList.remove('nav-hidden'); // Always show at top
        }
        lastScrollY = scrollY;

        // --- Update Score ---
        const score = document.getElementById('score-counter');
        if (score) score.innerText = Math.floor(scrollY * 1.5).toString().padStart(6, '0');

        // --- Horizontal Scroll Logic ---
        if (wrapper && track && isDesktop) {
            const startScroll = wrapper.offsetTop;
            const scrollableDistance = wrapper.offsetHeight - window.innerHeight; 
            const endScroll = startScroll + scrollableDistance;

            if (scrollY >= startScroll && scrollY <= endScroll) {
                const progress = (scrollY - startScroll) / scrollableDistance;
                const maxTranslate = track.scrollWidth - window.innerWidth + 100;
                const translateX = Math.max(0, Math.min(progress * maxTranslate, maxTranslate));
                
                track.style.transform = `translate3d(-${translateX}px, 0, 0)`;
            } else if (scrollY < startScroll) {
                track.style.transform = 'translate3d(0, 0, 0)';
            } else {
                const maxTranslate = track.scrollWidth - window.innerWidth + 100;
                track.style.transform = `translate3d(-${maxTranslate}px, 0, 0)`;
            }
        } else if(track && !isDesktop) {
            track.style.transform = 'none';
        }
    });

    /* ==========================================
       4. 3D TILT EFFECT (MOUSEMOVE)
       ========================================== */
    if (window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
        document.querySelectorAll('.window-panel').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                // Calcula rotação (max 8 graus para não distorcer muito o texto)
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                // Restaura transição suave
                card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                setTimeout(() => card.style.transition = 'border-color 0.3s, box-shadow 0.3s', 500); // Remove transição fixa após animar
            });
            
            card.addEventListener('mouseenter', () => {
                 card.style.transition = 'none'; // Remove transition para o mousemove ficar instantâneo
            });
        });
    }

    /* ==========================================
       5. ADVANCED SCROLL REVEAL (Intersection Observer)
       ========================================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.getAttribute('data-delay') || 0);
                
                // Complex reveal animation using AnimeJS
                anime({
                    targets: el,
                    translateY: [60, 0],
                    rotateX: [15, 0],
                    scale: [0.9, 1],
                    opacity: [0, 1],
                    duration: 1000,
                    delay: delay,
                    easing: 'easeOutElastic(1, .8)'
                });

                // Trigger text scramble if inside element
                const scrambleTarget = el.querySelector('.text-scramble');
                if (scrambleTarget) {
                    setTimeout(() => {
                        const fx = new TextScramble(scrambleTarget);
                        fx.setText(scrambleTarget.getAttribute('data-text'));
                    }, delay + 200);
                }

                observer.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-elem').forEach(el => {
        el.style.opacity = '0'; // Esconde inicialmente
        observer.observe(el);
    });

    /* ==========================================
       6. CURSORES & MOBILE MENU
       ========================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    
    if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorRing) {
        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;
        
        document.addEventListener('mousemove', (e) => {
            cursorDot.classList.remove('cursor-hidden');
            cursorRing.classList.remove('cursor-hidden');
            mouseX = e.clientX; mouseY = e.clientY;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        document.addEventListener('mouseleave', () => {
            cursorDot.classList.add('cursor-hidden');
            cursorRing.classList.add('cursor-hidden');
        });

        const renderCursor = () => {
            ringX += (mouseX - ringX) * 0.15; // Smooth interpolation
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        document.querySelectorAll('a, button, .interactive, .window-panel').forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover-state'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover-state'));
        });
        
        // Click particles
        document.addEventListener('click', (e) => {
            anime({ targets: cursorRing, scale: [1.2, 1], duration: 300, easing: 'easeOutElastic(1, .5)' });
            for(let i=0; i<6; i++){
                const p = document.createElement('div');
                p.className = 'click-particle';
                p.style.left = e.clientX + 'px';
                p.style.top = e.clientY + 'px';
                document.body.appendChild(p);
                const angle = Math.random() * Math.PI * 2;
                anime({
                    targets: p,
                    translateX: Math.cos(angle) * 40,
                    translateY: Math.sin(angle) * 40,
                    opacity: [1, 0],
                    duration: 600 + Math.random()*300,
                    easing: 'easeOutExpo',
                    complete: () => p.remove()
                });
            }
        });
    }

    // Mobile menu logic
    const mobileBtn = document.getElementById('mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-menu-header');
    const closeBtn2 = document.getElementById('close-menu-btn');
    
    const toggleMenu = () => {
        const isHidden = mobileMenu.classList.contains('opacity-0');
        if (isHidden) {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'hidden';
            anime({ targets: '#mobile-menu-window', scale: [0.9, 1], translateY: [20, 0], opacity: [0, 1], duration: 400, easing: 'easeOutElastic(1, .8)'});
        } else {
            anime({ targets: '#mobile-menu-window', scale: [1, 0.9], translateY: [0, 20], opacity: [1, 0], duration: 200, easing: 'easeInQuad', complete: () => {
                mobileMenu.classList.add('opacity-0', 'pointer-events-none');
                document.body.style.overflow = '';
            }});
        }
    };

    if(mobileBtn) mobileBtn.addEventListener('click', toggleMenu);
    if(closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if(closeBtn2) closeBtn2.addEventListener('click', toggleMenu);
    document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', toggleMenu));
    
    /* ==========================================
       7. FAQ ACCORDION LOGIC
       ========================================== */
    document.querySelectorAll('.faq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.nextElementSibling;
            const isOpen = answer.classList.contains('open');
            
            // Fecha todos os outros itens
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.classList.remove('open');
                ans.previousElementSibling.classList.remove('active');
            });

            // Abre o item clicado se este estiver fechado
            if (!isOpen) {
                answer.classList.add('open');
                btn.classList.add('active');
            }
        });
    });

});