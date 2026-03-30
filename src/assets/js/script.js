document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.innerWidth < 768;

    // BIOS BOOT LOGIC
    const bootLog = document.getElementById('boot-log');
    const bootLines = [
        "IPSUM BOOT LOADER v3.8.5_FIXED",
        "MEMORY TEST: 16384 KB OK",
        "MAPPING GAMEPLAY_TRACK... [PASS]",
        "OPTIMIZING_RESPONSIVE_ENGINES... [OK]",
        "ACCESS GRANTED. ENJOY THE VOID."
    ];

    let lineIdx = 0;
    function runBoot() {
        if (lineIdx < bootLines.length && bootLog) {
            const p = document.createElement('p');
            p.className = "mb-1 md:mb-2 block uppercase text-sm md:text-2xl";
            bootLog.appendChild(p);
            anime({
                targets: p, innerHTML: [0, bootLines[lineIdx]], round: 1, duration: 400, easing: 'linear',
                complete: () => { lineIdx++; setTimeout(runBoot, 100); }
            });
        } else if (bootLog) {
            setTimeout(() => {
                const screen = document.getElementById('boot-screen');
                if (screen) {
                    anime({
                        targets: screen, translateY: '-100%', duration: 1000, easing: 'easeInOutExpo',
                        complete: () => { screen.style.display = 'none'; startApp(); }
                    });
                }
            }, 600);
        }
    }
    runBoot();

    function startApp() {
        const navbar = document.getElementById('navbar');
        if(navbar) navbar.style.opacity = '1';

        anime({
            targets: ['#navbar', '#hero-image-container', '#hero-badge', '#hero-btns'],
            opacity: [0, 1], translateY: [20, 0], delay: anime.stagger(150), easing: 'easeOutExpo'
        });
        anime({ targets: '#hero-text', opacity: 1, scale: [0.95, 1], duration: 1200, easing: 'easeOutExpo' });
        initScroll();
        createGeometry();
    }

    function createGeometry() {
        const shardsContainer = document.getElementById('shards-container');
        const warpContainer = document.getElementById('warp-lines');
        if (shardsContainer) {
            const shardCount = isMobile ? 6 : 25;
            for (let i = 0; i < shardCount; i++) {
                const shard = document.createElement('div');
                shard.style.position = 'absolute'; shard.style.width = isMobile ? '6px' : '15px'; shard.style.height = isMobile ? '6px' : '15px';
                shard.style.background = 'var(--r-red)'; shard.style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
                shard.style.left = Math.random() * 100 + '%'; shard.style.top = Math.random() * 100 + '%';
                shardsContainer.appendChild(shard);
                anime({ targets: shard, translateX: () => anime.random(-150, 150), translateY: () => anime.random(-150, 150), rotate: '1turn', duration: () => anime.random(6000, 12000), easing: 'linear', direction: 'alternate', loop: true });
            }
        }
        if (warpContainer) {
            const rayCount = isMobile ? 8 : 60;
            for (let i = 0; i < rayCount; i++) {
                const line = document.createElement('div');
                line.className = 'warp-ray'; line.style.position = 'absolute'; line.style.width = '1px'; line.style.height = isMobile ? '80px' : '150px'; line.style.backgroundColor = 'var(--r-cyan)';
                line.style.opacity = '0'; line.style.left = Math.random() * 100 + '%'; line.style.top = Math.random() * 100 + '%';
                warpContainer.appendChild(line);
            }
        }
        anime({ targets: '#cube-inner', rotateZ: '1turn', duration: 10000, easing: 'linear', loop: true });
        anime({ targets: '#cube-mid', rotateX: '1turn', duration: 15000, easing: 'linear', loop: true });
        anime({ targets: '#cube-outer', rotateY: '1turn', duration: 20000, easing: 'linear', loop: true });
    }

    function initScroll() {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 1.5
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Referências do DOM
        const heroWrapper = document.getElementById('hero-wrapper');
        const heroCore = document.getElementById('geometric-core');
        const heroTitle = document.getElementById('hero-title');
        const bgGrid = document.getElementById('bg-grid');
        const cubes = document.querySelectorAll('.neural-orbit');
        const rays = document.querySelectorAll('.warp-ray');

        const gameplaySection = document.getElementById('gameplay');
        const horizontalTrack = document.getElementById('horizontal-track');
        const sobreSection = document.getElementById('sobre');
        const sobrePanel = document.getElementById('sobre-panel');
        const counter = document.getElementById('score-counter');

        // --- SISTEMA DE CACHE DE MEDIDAS (Evita Layout Thrashing) ---
        let metrics = {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            gameplayTop: 0,
            gameplayHeight: 0,
            trackScrollWidth: 0,
            sobreTop: 1000
        };

        function updateMetrics() {
            metrics.windowHeight = window.innerHeight;
            metrics.windowWidth = window.innerWidth;
            if (gameplaySection) {
                metrics.gameplayTop = gameplaySection.offsetTop;
                metrics.gameplayHeight = gameplaySection.offsetHeight;
            }
            if (horizontalTrack) {
                metrics.trackScrollWidth = horizontalTrack.scrollWidth;
            }
            if (sobreSection) {
                metrics.sobreTop = sobreSection.offsetTop;
            }
        }

        // Calcular medidas no início e ao redimensionar a tela
        updateMetrics();
        window.addEventListener('resize', updateMetrics);

        lenis.on('scroll', ({ scroll }) => {
            if (counter) counter.innerText = Math.floor(scroll).toString().padStart(6, '0');

            // --- OTIMIZAÇÃO HERO WARP ---
            const warpTarget = metrics.sobreTop;
            if (scroll < warpTarget + 800) {
                const warpProgress = Math.min(1, Math.max(0, scroll / (warpTarget || 1)));

                if (heroWrapper) {
                    const warpFactor = isMobile ? 20 : 60;
                    const warpScale = 1 + (Math.pow(warpProgress, 3) * warpFactor);
                    const opacity = warpProgress > 0.9 ? 1 - ((warpProgress - 0.9) * 10) : 1;

                    // Usando toFixed para evitar tremores de sub-pixel no renderizador da GPU
                    heroWrapper.style.transform = `scale(${warpScale.toFixed(3)}) translate3d(0,0,0)`;
                    heroWrapper.style.opacity = Math.max(0, opacity).toFixed(2);

                    const zRotate = (45 + (warpProgress * (isMobile ? 600 : 1500))).toFixed(2);
                    if(heroCore) heroCore.style.transform = `rotateZ(${zRotate}deg) translate3d(0,0,0)`;

                    cubes.forEach((cube, i) => {
                        if (isMobile && i > 0) cube.style.opacity = (1 - (warpProgress * 2)).toFixed(2);
                        const zDist = isMobile ? 100 : 400;
                        const zTranslate = (warpProgress * (i + 1) * zDist).toFixed(2);
                        cube.style.transform = `translate3d(0,0,${zTranslate}px)`;
                    });

                    if (heroTitle) {
                        heroTitle.style.opacity = (1 - (warpProgress * 5)).toFixed(2);
                        const titleY = (warpProgress * (isMobile ? -80 : -400)).toFixed(2);
                        heroTitle.style.transform = `translate3d(0, ${titleY}px, 0)`;
                    }

                    rays.forEach((ray) => {
                        const p = Math.max(0, (warpProgress - 0.05) * 2);
                        ray.style.opacity = (p * 0.5).toFixed(2);
                        const rayY = (p * (isMobile ? 600 : 2000)).toFixed(2);
                        const rayScale = (1 + p * (isMobile ? 10 : 30)).toFixed(2);
                        ray.style.transform = `translate3d(0, ${rayY}px, 0) scaleY(${rayScale})`;
                    });

                    if (bgGrid) {
                        const gridZ = (warpProgress * 200).toFixed(2);
                        bgGrid.style.transform = `perspective(400px) rotateX(75deg) translate3d(0,0,${gridZ}px)`;
                        bgGrid.style.opacity = (0.1 + (warpProgress * 0.7)).toFixed(2);
                    }
                }
            }

            // --- SCROLL HORIZONTAL (DESKTOP APENAS) ---
            if (!isMobile && gameplaySection && horizontalTrack) {
                // Cálculo usando as métricas cacheadas, sem forçar Reflow do navegador
                let progress = (scroll - metrics.gameplayTop) / (metrics.gameplayHeight - metrics.windowHeight);
                progress = Math.max(0, Math.min(1, progress));

                const maxTranslate = metrics.trackScrollWidth - metrics.windowWidth;
                const translateX = (-progress * maxTranslate).toFixed(2);
                horizontalTrack.style.transform = `translate3d(${translateX}px, 0, 0)`;
            }

            // REVELAÇÃO DO PAINEL SOBRE
            if (sobrePanel && scroll > (warpTarget * 0.2)) {
                sobrePanel.style.opacity = "1";
                sobrePanel.style.transform = "translate3d(0, 0, 0)";
            }
        });

        // Intersection Observer Otimizado para Mobile
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translate3d(0,0,0) scale(1)";
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });

        document.querySelectorAll('.reveal-up').forEach(el => {
            el.style.opacity = "0";
            el.style.transform = `translate3d(0, ${isMobile ? '20px' : '50px'}, 0) scale(0.98)`;
            el.style.transition = "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease";
            revealObserver.observe(el);
        });
    }

    // MENU MOBILE OTIMIZADO
    const mobileBtn = document.getElementById('mobile-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const closeHeaderBtn = document.getElementById('close-menu-header');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMenu = (open) => {
        if (!mobileMenu) return;
        mobileMenu.style.pointerEvents = open ? 'auto' : 'none';
        anime({
            targets: mobileMenu,
            translateY: open ? ['100%', '0%'] : '100%',
            duration: 500,
            easing: 'easeOutQuart'
        });
    };

    if (mobileBtn) mobileBtn.addEventListener('click', () => toggleMenu(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
    if (closeHeaderBtn) closeHeaderBtn.addEventListener('click', () => toggleMenu(false));
    mobileLinks.forEach(l => l.addEventListener('click', () => toggleMenu(false)));

    // VÍDEO ARCADE
    const arcade = document.querySelector('.arcade-cabinet');
    const video = document.getElementById('game-video');
    if (arcade && video) {
        const playVideo = () => {
            video.play().catch(() => { });
            video.style.opacity = "1";
            const hint = document.getElementById('play-hint');
            if (hint) hint.style.opacity = "0";
        };
        const pauseVideo = () => {
            video.pause();
            video.style.opacity = "0.6";
            const hint = document.getElementById('play-hint');
            if (hint) hint.style.opacity = "1";
        };
        arcade.addEventListener('mouseenter', playVideo);
        arcade.addEventListener('mouseleave', pauseVideo);
        arcade.addEventListener('touchstart', () => {
            if (video.paused) playVideo(); else pauseVideo();
        }, { passive: true });
    }
});
