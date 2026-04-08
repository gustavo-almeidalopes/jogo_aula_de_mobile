document.addEventListener('DOMContentLoaded', () => {
    // Deteta se o dispositivo suporta hover/pointer (touch = isMobile)
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    // Breakpoint CSS para scripts
    const isTabletOrDesktop = window.innerWidth >= 768;

    // --- 0. CURSOR PIXELADO & INTERATIVIDADE MAGNÉTICA ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    
    let mouseX = window.innerWidth / 2; let mouseY = window.innerHeight / 2;
    let ringX = mouseX; let ringY = mouseY;

    if (!isMobile && isTabletOrDesktop) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        function renderCursor() {
            ringX += (mouseX - ringX) * 0.2; 
            ringY += (mouseY - ringY) * 0.2;
            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        const interactables = document.querySelectorAll('.interactive, a, button');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorRing.classList.add('cursor-hover-state');
                cursorDot.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('cursor-hover-state');
                cursorDot.style.opacity = '1';
                if(el.classList.contains('magnetic-btn')) {
                    anime({ targets: el, translateX: 0, translateY: 0, duration: 400, easing: 'easeOutQuad' });
                }
            });
            
            if(el.classList.contains('magnetic-btn')) {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2; const y = e.clientY - rect.top - rect.height / 2;
                    anime({ targets: el, translateX: x * 0.2, translateY: y * 0.2, duration: 50, easing: 'linear' });
                });
            }
        });

        document.addEventListener('click', (e) => {
            cursorRing.classList.add('cursor-active-state');
            setTimeout(() => cursorRing.classList.remove('cursor-active-state'), 150);

            const particleCount = 8; const colors = ['#EB70BB', '#DD4B50', '#71A41C', '#F4E560', '#983E3C'];
            for(let i=0; i<particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'click-particle';
                particle.style.left = e.clientX + 'px'; particle.style.top = e.clientY + 'px';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                document.body.appendChild(particle);

                const angle = Math.random() * Math.PI * 2; const velocity = 40 + Math.random() * 60;
                anime({
                    targets: particle, translateX: Math.cos(angle) * velocity, translateY: Math.sin(angle) * velocity,
                    opacity: [1, 0], scale: [1, 0], duration: 400 + Math.random() * 200, easing: 'easeOutQuad', complete: () => particle.remove()
                });
            }
        });
    }

    // --- 1. EFEITO MATRIX ---
    function createMatrixBg(containerId) {
        const container = document.getElementById(containerId);
        if(!container) return;
        const columns = Math.floor(window.innerWidth / (isMobile ? 40 : 60));
        for(let i=0; i<columns; i++) {
            const stream = document.createElement('div');
            stream.className = `absolute font-terminal ${isMobile ? 'text-[10px]' : 'text-sm'} text-retro-green opacity-20`;
            stream.style.left = (i * (isMobile ? 40 : 60)) + 'px'; stream.style.top = Math.random() * -100 + '%';
            stream.innerText = Math.random().toString(36).substring(2, 10).toUpperCase();
            container.appendChild(stream);

            let lastUpdate = 0;
            anime({
                targets: stream, translateY: [0, window.innerHeight + 200],
                duration: anime.random(5000, 10000), easing: 'linear', loop: true,
                update: function(anim) { 
                    if(anim.currentTime - lastUpdate > 300) {
                        if(Math.random() > 0.8) stream.innerText = Math.random().toString(36).substring(2, 10).toUpperCase(); 
                        lastUpdate = anim.currentTime;
                    }
                }
            });
        }
    }
    createMatrixBg('matrix-hero'); createMatrixBg('matrix-footer'); createMatrixBg('matrix-modal');

    // --- 2. SEQUÊNCIA DE BOOT ---
    const bootLog = document.getElementById('boot-log');
    const bootOverlay = document.getElementById('boot-screen');
    const bootLines = [
        "> IPSUM KERNEL v3.8.5_FIXED", "> ALOCANDO MEMÓRIA...", "> INJETANDO ANIMAÇÕES [██████████] 100%", "> ACESSO CONCEDIDO."
    ];

    let lineIdx = 0;
    function runBoot() {
        if (lineIdx < bootLines.length) {
            const p = document.createElement('div'); bootLog.appendChild(p);
            anime({ targets: p, innerHTML: [0, bootLines[lineIdx]], round: 1, duration: 100, easing: 'linear', complete: () => { lineIdx++; setTimeout(runBoot, 50); } });
        } else {
            setTimeout(() => {
                anime({
                    targets: bootOverlay, opacity: 0, scale: 1.05, filter: 'blur(5px)', duration: 600, easing: 'easeInOutExpo',
                    complete: () => { bootOverlay.style.display = 'none'; startCoreSystems(); }
                });
            }, 200);
        }
    }
    runBoot();

    // --- 3. INICIALIZAÇÃO PÓS-BOOT ---
    function startCoreSystems() {
        anime({ targets: '#navbar', translateY: ['-100%', 0], opacity: [0, 1], duration: 1000, easing: 'easeOutElastic(1, .8)' });
        
        const translateZVal = isMobile ? 50 : 200;
        const translateYVal = isMobile ? 20 : 50;
        
        anime({
            targets: '.hero-letter', translateZ: [translateZVal, 0], translateY: [translateYVal, 0], rotateX: [90, 0], rotateY: [()=>anime.random(-30, 30), 0],
            opacity: [0, 1], color: ['#f2f2f7', '#8e8e93'], delay: anime.stagger(100), duration: 1200, easing: 'easeOutElastic(1, .6)'
        });

        anime({ targets: '#hero-subtitle', translateY: [30, 0], opacity: [0, 1], delay: 600, duration: 800, easing: 'easeOutExpo' });
        anime({ targets: '#hero-buttons a', scale: [0.9, 1], opacity: [0, 1], delay: anime.stagger(100, {start: 800}), duration: 600, easing: 'easeOutElastic(1, .8)' });

        initLenisScroll(); initScrollReveal(); initContinuousFloating(); initArcadeInteractions(); initModalSystem(); initMobileMenu();
    }
    
    function initMobileMenu() {
        const mobileBtn = document.getElementById('mobile-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeMenuBtn = document.getElementById('close-menu-btn');
        const closeMenuHeader = document.getElementById('close-menu-header');
        const mobileLinks = document.querySelectorAll('.mobile-link');
        const mobileWindow = document.getElementById('mobile-menu-window');

        function openMenu() {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            anime({ targets: mobileWindow, scale: [0.9, 1], opacity: [0, 1], duration: 400, easing: 'easeOutElastic(1, .8)' });
            document.body.style.overflow = 'hidden';
        }
        function closeMenu() {
            anime({ targets: mobileWindow, scale: [1, 0.9], opacity: [1, 0], duration: 200, easing: 'easeInQuad', complete: () => {
                mobileMenu.classList.add('opacity-0', 'pointer-events-none');
                document.body.style.overflow = '';
            }});
        }
        mobileBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);
        closeMenuHeader.addEventListener('click', closeMenu);
        mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // --- 4. TEXT SCRAMBLE ---
    class TextScramble {
        constructor(el) { this.el = el; this.chars = '!<>-_\\/[]{}—=+*^?#________'; this.update = this.update.bind(this); }
        setText(newText) {
            const oldText = this.el.innerText; const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve); this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || ''; const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40); const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest); this.frame = 0; this.update(); return promise;
        }
        update() {
            let output = ''; let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) { complete++; output += to; } 
                else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) { char = this.chars[Math.floor(Math.random() * this.chars.length)]; this.queue[i].char = char; }
                    output += `<span class="text-retro-pink opacity-80">${char}</span>`;
                } else { output += from; }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) { this.resolve(); } else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
        }
    }

    // --- 5. SCROLL REVEAL ---
    function initScrollReveal() {
        const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target; const delay = parseInt(el.getAttribute('data-delay') || '0');
                    
                    const moveX = isMobile ? 30 : 100;
                    const moveY = isMobile ? 30 : 80;
                    
                    if(el.classList.contains('reveal-right')) {
                        anime({ targets: el, translateX: [moveX, 0], rotateY: [-5, 0], opacity: [0, 1], delay: delay, duration: 800, easing: 'easeOutElastic(1, 1)' });
                    } else if(el.classList.contains('reveal-up')) {
                        anime({ targets: el, translateY: [moveY, 0], rotateX: [10, 0], opacity: [0, 1], delay: delay, duration: 800, easing: 'easeOutElastic(1, 1)' });
                    } else if(el.classList.contains('reveal-scale')) {
                        anime({ targets: el, scale: [0.95, 1], opacity: [0, 1], delay: delay, duration: 800, easing: 'easeOutElastic(1, 1)' });
                    }

                    if(el.classList.contains('text-scramble')) {
                        const fx = new TextScramble(el); fx.setText(el.getAttribute('data-text'));
                    }

                    if(el.classList.contains('roster-card')) {
                        anime({ targets: el.querySelector('.scanline-fx'), translateY: ['-100%', '100%'], opacity: [1, 0], duration: 1500, delay: delay + 500, easing: 'linear' });
                    }

                    obs.unobserve(el);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-right, .reveal-up, .reveal-scale, .text-scramble').forEach(el => revealObserver.observe(el));
    }

    // --- 6. ANIMAÇÕES CONTÍNUAS ---
    function initContinuousFloating() {
        anime({ targets: '.floating-card', translateY: [-6, 6], duration: 3000, direction: 'alternate', loop: true, easing: 'easeInOutSine' });
        anime({ targets: '.anime-spin-slow', rotate: '1turn', duration: 40000, easing: 'linear', loop: true });
        anime({ targets: '.anime-spin-reverse', rotate: '-1turn', duration: 30000, easing: 'linear', loop: true });
        anime({ targets: '.anime-spin-fast', rotate: '1turn', duration: 15000, easing: 'linear', loop: true });
        anime({ targets: '.pulse-glow', scale: [1, 1.05], boxShadow: ['0 0 30px #EB70BB', '0 0 60px #DD4B50'], duration: 2000, direction: 'alternate', loop: true, easing: 'easeInOutSine' });
        
        const shardsContainer = document.getElementById('shards-container');
        if(shardsContainer && !isMobile) { 
            for(let i=0; i<8; i++) {
                const shard = document.createElement('div');
                shard.className = 'absolute w-2 h-2 bg-retro-red opacity-20 rotate-45';
                shard.style.left = Math.random() * 100 + '%'; shard.style.top = Math.random() * 100 + '%';
                shardsContainer.appendChild(shard);
                anime({ targets: shard, translateX: ()=>anime.random(-100, 100), translateY: ()=>anime.random(-100, 100), rotate: '1turn', duration: ()=>anime.random(6000, 12000), direction: 'alternate', loop: true, easing: 'linear' });
            }
        }
    }

    // --- 7. ARCADE E MODAL DEVS ---
    function initArcadeInteractions() {
        const btns = document.querySelectorAll('.arcade-btn');
        let coins = 0;
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                coins++;
                document.getElementById('arcade-coins').innerText = `CREDITS: ${coins.toString().padStart(2, '0')}`;
                document.getElementById('arcade-msg').innerText = "PRESS_START";
                anime({ targets: '#arcade-screen', filter: ['contrast(300%) hue-rotate(180deg) saturate(300%)', 'contrast(150%) hue-rotate(0deg) saturate(200%)'], translateX: [-4, 4, -2, 2, 0], duration: 400, easing: 'easeInOutSine' });
            });
        });
    }

    function initModalSystem() {
        const devData = {
            '1': {
                name: 'Master_Dev',
                role: 'Lead Architect & Wizard',
                img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400',
                imgHue: 'sepia hue-rotate-[10deg] saturate-150',
                color: 'text-retro-yellow',
                borderColor: 'border-retro-yellow',
                bgHeader: 'bg-retro-yellow text-retro-black',
                bio: '> Desenvolvedor principal e arquiteto de sistemas por trás do projeto IPSUM. Especialista em manipulação extrema do DOM e recriação de interfaces retro em motores Web.<br><br>> Stack de Combate: <span class="text-retro-yellow font-bold">HTML5, Tailwind, JS Vanilla, AnimeJS e café.</span>',
                quote: '"Escrevo código como se estivesse a desarmar uma bomba-relógio térmica em 1994."',
                github: 'https://github.com/masterdev',
                linkedin: 'https://linkedin.com/in/masterdev'
            },
            '2': {
                name: 'Pixel_Ninja',
                role: 'UI/UX Designer & Artista',
                img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400',
                imgHue: 'sepia hue-rotate-[320deg] saturate-150',
                color: 'text-retro-pink',
                borderColor: 'border-retro-pink',
                bgHeader: 'bg-retro-pink text-retro-black',
                bio: '> Mestre da estética retro e cyberpunk. Responsável por traduzir a nostalgia dos anos 90 para a era moderna, desenhando cada pixel, grid e glitch visual no ecrã.<br><br>> Arsenal Visual: <span class="text-retro-pink font-bold">Figma, Photoshop, CRT Shaders e Insónia.</span>',
                quote: '"O segredo de um bom glitch não é o erro aleatório, mas sim a intenção caótica por trás dele."',
                github: 'https://github.com/pixelninja',
                linkedin: 'https://linkedin.com/in/pixelninja'
            },
            '3': {
                name: 'Ghost_Node',
                role: 'Backend & Networking',
                img: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400',
                imgHue: 'sepia hue-rotate-[180deg] saturate-150',
                color: 'text-retro-brown',
                borderColor: 'border-retro-brown',
                bgHeader: 'bg-retro-brown text-retro-white',
                bio: '> O fantasma na máquina. Operador responsável por todas as rotinas de servidor, gestão de bases de dados em tempo real e arquitetura de multiplayer do IPSUM.<br><br>> Cinto de Utilidades: <span class="text-retro-brown font-bold">Node.js, WebSockets, Python, Linux.</span>',
                quote: '"Se o frontend é a máscara de neon, eu sou os cabos enferrujados que mantêm tudo a respirar."',
                github: 'https://github.com/ghostnode',
                linkedin: 'https://linkedin.com/in/ghostnode'
            }
        };

        const btnsOpen = document.querySelectorAll('.btn-dev-modal');
        const modal = document.getElementById('dev-modal');
        const modalContent = document.getElementById('dev-modal-content');
        const btnClose = document.getElementById('close-dev-modal');
        const scrambleTitle = document.querySelector('.text-scramble-modal');

        btnsOpen.forEach(btn => {
            btn.addEventListener('click', () => {
                const devId = btn.getAttribute('data-dev');
                const data = devData[devId];

                if(data) {
                    document.getElementById('modal-dev-name').innerText = data.name;
                    document.getElementById('modal-dev-name').className = `font-arcade ${data.color} text-base md:text-xl lg:text-3xl mb-2 md:mb-3 uppercase text-center tracking-widest bg-[${data.color}]/10 p-3 w-full`;
                    document.getElementById('modal-dev-role').innerText = data.role;
                    
                    const imgEl = document.getElementById('modal-dev-img');
                    imgEl.src = data.img;
                    imgEl.className = `w-full h-full object-cover grayscale contrast-200 ${data.imgHue} opacity-90`;
                    
                    document.getElementById('modal-img-border').className = `relative aspect-square border-4 ${data.borderColor} overflow-hidden bg-black mb-4 md:mb-6 w-full max-w-[200px] md:max-w-[280px] lg:max-w-[350px] shadow-[0_0_20px_currentColor] ${data.color}`;
                    document.getElementById('modal-header-bg').className = `window-header flex-shrink-0 text-[10px] md:text-sm py-4 px-4 md:py-4 md:px-6 flex justify-between items-center ${data.bgHeader}`;
                    modalContent.className = `window-panel w-full h-full md:h-auto max-w-5xl md:max-w-4xl lg:max-w-5xl md:max-h-[90vh] flex flex-col md:scale-90 opacity-0 relative z-10 md:shadow-[0_0_50px_currentColor] border-0 md:border-4 rounded-none md:rounded-sm overflow-hidden ${data.borderColor} ${data.color}`;

                    document.getElementById('modal-dev-history-title').className = `font-arcade ${data.color} text-[14px] md:text-lg lg:text-2xl mb-4 md:mb-8 uppercase border-b-2 border-retro-gray/50 pb-2 md:pb-4 text-scramble-modal inline-block`;
                    document.getElementById('modal-dev-bio').innerHTML = data.bio;
                    
                    const quoteEl = document.getElementById('modal-dev-quote');
                    quoteEl.className = `animate-pulse ${data.color} bg-[${data.color}]/10 p-5 md:p-6 border-l-4 ${data.borderColor} mt-6 md:mt-8 text-[14px] md:text-xl font-arcade leading-loose`;
                    quoteEl.innerHTML = `> ${data.quote}`;
                    
                    document.getElementById('modal-dev-github').href = data.github;
                    document.getElementById('modal-dev-linkedin').href = data.linkedin;
                }

                modal.classList.remove('pointer-events-none');
                document.body.style.overflow = 'hidden'; 
                
                if (window.innerWidth < 768) {
                    anime({ targets: modal, opacity: [0, 1], duration: 250, easing: 'linear' });
                    anime({ targets: modalContent, translateY: ['100%', 0], opacity: [0, 1], duration: 400, easing: 'easeOutQuad' });
                } else {
                    anime({ targets: modal, opacity: [0, 1], duration: 300, easing: 'linear' });
                    anime({ targets: modalContent, scale: [0.9, 1], rotateX: [5, 0], translateY: [20, 0], opacity: [0, 1], duration: 500, easing: 'easeOutElastic(1, .8)' });
                }
                
                if(scrambleTitle) {
                    const fx = new TextScramble(scrambleTitle);
                    fx.setText("Histórico_Operacional");
                }
            });
        });

        const closeAction = () => {
            document.body.style.overflow = ''; 
            if (window.innerWidth < 768) {
                anime({
                    targets: modalContent, translateY: [0, '100%'], opacity: 0, duration: 300, easing: 'easeInQuad',
                    complete: () => {
                        anime({ targets: modal, opacity: 0, duration: 200, easing: 'linear', complete: () => modal.classList.add('pointer-events-none') });
                    }
                });
            } else {
                anime({
                    targets: modalContent, scale: 0.95, rotateX: -5, translateY: -10, opacity: 0, duration: 250, easing: 'easeInQuad',
                    complete: () => {
                        anime({ targets: modal, opacity: 0, duration: 200, easing: 'linear', complete: () => modal.classList.add('pointer-events-none') });
                    }
                });
            }
        };

        btnClose.addEventListener('click', closeAction);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeAction(); });
    }

    // --- 8. LENIS SCROLL & CAROUSEL (RESPONSIVE FIX) ---
    function initLenisScroll() {
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1.2 });
        const scoreEl = document.getElementById('score-counter');
        const track = document.getElementById('protocols-track');
        const wrapper = document.getElementById('gameplay');
        const heroGeometry = document.getElementById('hero-geometry');
        const heroContent = document.getElementById('hero-content');

        const magneticCards = track ? track.querySelectorAll('.magnetic-card') : [];
        let lastScore = -1;
        let metrics = { top: 0, height: 0, maxTranslate: 0, windowHeight: window.innerHeight, isDesktop: window.innerWidth >= 768 };

        function updateMetrics() {
            metrics.windowHeight = window.innerHeight;
            metrics.isDesktop = window.innerWidth >= 768;
            
            if(wrapper && track && metrics.isDesktop) {
                const rect = wrapper.getBoundingClientRect();
                metrics.top = rect.top + window.scrollY; 
                metrics.height = wrapper.offsetHeight;
                const paddingOffset = 96;
                metrics.maxTranslate = track.scrollWidth - track.parentElement.offsetWidth + paddingOffset;
            } else if (track) {
                // Reset transform se for mobile
                track.style.transform = 'none';
                magneticCards.forEach(card => card.style.transform = 'none');
            }
        }

        updateMetrics();
        window.addEventListener('resize', updateMetrics);

        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);

        lenis.on('scroll', (e) => {
            const scrollY = e.animatedScroll;
            
            if(scoreEl) {
                const newScore = Math.floor(scrollY * 2.5);
                if (newScore !== lastScore) {
                    scoreEl.innerText = newScore.toString().padStart(6, '0');
                    lastScore = newScore;
                }
            }

            if (heroGeometry && heroContent) {
                const heroProgress = Math.max(0, Math.min(scrollY / metrics.windowHeight, 1.2));
                if(metrics.isDesktop) {
                    heroGeometry.style.transform = `perspective(1000px) rotateX(${heroProgress * 45}deg) scale(${1 + heroProgress * 2}) translateZ(0)`;
                    heroGeometry.style.opacity = Math.max(0, 1 - (heroProgress * 1.2));
                    heroContent.style.transform = `translate3d(0, ${heroProgress * 150}px, 0) scale(${1 - heroProgress * 0.05})`;
                    heroContent.style.opacity = Math.max(0, 1 - heroProgress * 1.5);
                } else {
                    const heroProgressM = Math.max(0, Math.min(scrollY / (metrics.windowHeight * 0.8), 1));
                    heroContent.style.transform = `translate3d(0, ${heroProgressM * 50}px, 0)`;
                    heroContent.style.opacity = Math.max(0, 1 - heroProgressM * 1.5);
                }
            }

            // APENAS processa o scroll horizontal se for Tablet/Desktop
            if (wrapper && track && metrics.isDesktop) {
                const startScroll = metrics.top;
                const scrollableDistance = metrics.height - metrics.windowHeight;
                const endScroll = startScroll + scrollableDistance;

                if (scrollY >= startScroll && scrollY <= endScroll) {
                    const progress = (scrollY - startScroll) / scrollableDistance;
                    const clampedProgress = Math.max(0, Math.min(progress, 1));
                    
                    track.style.transform = `translate3d(-${clampedProgress * metrics.maxTranslate}px, 0, 0)`;
                    const skewVal = e.velocity * 0.05; 
                    magneticCards.forEach(card => card.style.transform = `skewX(${skewVal}deg) translateZ(0)`);
                } else if (scrollY < startScroll) {
                    track.style.transform = `translate3d(0, 0, 0)`;
                    magneticCards.forEach(card => card.style.transform = `skewX(0deg) translateZ(0)`);
                } else {
                    track.style.transform = `translate3d(-${metrics.maxTranslate}px, 0, 0)`;
                    magneticCards.forEach(card => card.style.transform = `skewX(0deg) translateZ(0)`);
                }
            }
        });
    }
});
