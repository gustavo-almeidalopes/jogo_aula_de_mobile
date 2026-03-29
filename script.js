document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Lucide Icons
    lucide.createIcons();

    // 1. Configurar Lenis (Smooth Scroll Premium)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // OTIMIZAÇÃO: Cache de variáveis do DOM para o scroll não fritar o processador
    let winHeight = window.innerHeight;
    let sobreOffset = document.getElementById('sobre')?.offsetTop || 0;
    const universoSection = document.getElementById('universo');
    let universoTop = universoSection?.offsetTop || 0;
    let universoHeight = universoSection?.offsetHeight || 0;

    window.addEventListener('resize', () => {
        winHeight = window.innerHeight;
        if (document.getElementById('sobre')) sobreOffset = document.getElementById('sobre').offsetTop;
        if (universoSection) {
            universoTop = universoSection.offsetTop;
            universoHeight = universoSection.offsetHeight;
        }
    });

    // 2. Cursor Customizado Magnético Otimizado
    if (window.innerWidth >= 768) {
        const cursor = document.getElementById('custom-cursor');
        const cursorFollower = document.getElementById('custom-cursor-follower');
        const magneticBtns = document.querySelectorAll('.magnetic-btn, a, button, .open-modal-btn');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let followerX = mouseX;
        let followerY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Calcula a centralização do ponto (tamanho 10px -> desvio de -5px)
            cursor.style.transform = `translate3d(${mouseX - 5}px, ${mouseY - 5}px, 0)`;
        }, { passive: true }); // passive: true evita bloquear o scroll nativo

        function animateCursor() {
            followerX += (mouseX - followerX) * 0.2;
            followerY += (mouseY - followerY) * 0.2;
            // Calcula a centralização do aro (tamanho 30px -> desvio de -15px)
            cursorFollower.style.transform = `translate3d(${followerX - 15}px, ${followerY - 15}px, 0)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        magneticBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            btn.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // 3. Controlo de Tema (Light/Dark)
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });

    // 4. Menu Mobile
    const mobileBtn = document.getElementById('mobile-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const bar1 = document.getElementById('bar1');
    const bar2 = document.getElementById('bar2');

    function toggleMenu() {
        if (mobileMenu.classList.contains('translate-y-0')) {
            mobileMenu.classList.remove('translate-y-0', 'opacity-100');
            mobileMenu.classList.add('translate-y-8', 'opacity-0', 'invisible');
            bar1.style.transform = 'translateY(0) rotate(0)';
            bar2.style.transform = 'translateY(0) rotate(0)';
        } else {
            mobileMenu.classList.remove('translate-y-8', 'opacity-0', 'invisible');
            mobileMenu.classList.add('translate-y-0', 'opacity-100');
            bar1.style.transform = 'translateY(3px) rotate(45deg)';
            bar2.style.transform = 'translateY(-3px) rotate(-45deg)';
        }
    }
    mobileBtn?.addEventListener('click', toggleMenu);
    document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', toggleMenu));

    // 5. Parallax e Coreografia de Scroll (Usando as variáveis com cache)
    const heroScrollImage = document.getElementById('hero-scroll-image');
    const navbar = document.getElementById('navbar');
    const cards = document.querySelectorAll('.lore-card');
    const dots = document.querySelectorAll('.timeline-dot');

    lenis.on('scroll', (e) => {
        const scrollY = e.scroll;

        // OTIMIZAÇÃO: Animação Parallax do Hero usando offset cached
        if (heroScrollImage && sobreOffset > 0) {
            const progress = Math.min(Math.max(scrollY / sobreOffset, 0), 1);
            const rotation = -(progress * 225);
            const scale = 1 + (Math.pow(progress, 3) * 7);
            const translateY = progress * (winHeight * 0.45);

            heroScrollImage.style.transform = `translate3d(0, ${translateY}px, 0) rotate(${rotation}deg) scale(${scale})`;
        }

        // OTIMIZAÇÃO: Navbar background toggle
        if (scrollY > 50) {
            navbar.classList.add('bg-white/80', 'dark:bg-[#050505]/80', 'backdrop-blur-xl', 'border-gray-200', 'dark:border-white/10', 'py-4');
            navbar.classList.remove('border-transparent', 'py-6');
        } else {
            navbar.classList.remove('bg-white/80', 'dark:bg-[#050505]/80', 'backdrop-blur-xl', 'border-gray-200', 'dark:border-white/10', 'py-4');
            navbar.classList.add('border-transparent', 'py-6');
        }

        // OTIMIZAÇÃO: Timeline do Universo sem usar getBoundingClientRect no loop
        if (window.innerWidth >= 768 && cards.length > 0 && universoTop > 0) {
            // Progresso da seção: se o scrollY estiver antes da secção é negativo, depois é > 1
            const progress = Math.max(0, Math.min(1, (scrollY - universoTop) / (universoHeight - winHeight)));

            const totalPhases = 3;
            const phase = progress * totalPhases;
            const currentIndex = Math.floor(phase);
            const phaseProgress = phase % 1;

            cards.forEach((card, index) => {
                dots[index].style.backgroundColor = '';
                dots[index].style.transform = 'translateZ(0) scale(1)';

                let x = 0; let y = 0; let scale = 1; let opacity = 0; let zIndex = 1;

                if (currentIndex === 0) {
                    if (index === 0) {
                        y = 150 - (phaseProgress * 150);
                        opacity = phaseProgress;
                        scale = 0.95 + (phaseProgress * 0.05);
                        zIndex = 10;
                        dots[0].style.backgroundColor = '#ff3366';
                        dots[0].style.transform = `translateZ(0) scale(${1 + (phaseProgress * 0.5)})`;
                    }
                } else if (currentIndex === 1) {
                    if (index === 0) {
                        y = -(phaseProgress * 100);
                        opacity = 1 - (phaseProgress * 1.5);
                        scale = 1 - (phaseProgress * 0.05);
                        zIndex = 5;
                    } else if (index === 1) {
                        x = 400 - (phaseProgress * 400);
                        opacity = phaseProgress;
                        scale = 0.95 + (phaseProgress * 0.05);
                        zIndex = 10;
                        dots[1].style.backgroundColor = '#ff3366';
                        dots[1].style.transform = `translateZ(0) scale(${1 + (phaseProgress * 0.5)})`;
                    }
                } else if (currentIndex === 2) {
                    if (index === 1) {
                        y = -(phaseProgress * 100);
                        opacity = 1 - (phaseProgress * 1.5);
                        scale = 1 - (phaseProgress * 0.05);
                        zIndex = 5;
                    } else if (index === 2) {
                        x = -400 + (phaseProgress * 400);
                        opacity = phaseProgress;
                        scale = 0.95 + (phaseProgress * 0.05);
                        zIndex = 10;
                        dots[2].style.backgroundColor = '#ff3366';
                        dots[2].style.transform = `translateZ(0) scale(${1 + (phaseProgress * 0.5)})`;
                    }
                }

                card.style.opacity = Math.max(0, opacity);
                card.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
                card.style.zIndex = zIndex;
            });

            if (progress >= 1) {
                cards.forEach((c, i) => {
                    if (i === 2) {
                        c.style.opacity = 1;
                        c.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
                        c.style.zIndex = 10;
                        dots[i].style.backgroundColor = '#ff3366';
                        dots[i].style.transform = 'translateZ(0) scale(1.5)';
                    } else {
                        c.style.opacity = 0;
                    }
                });
            }
        }
    });

    // 6. Controlo de Vídeo Interativo
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('gameplay-video');
    const playBtn = document.getElementById('play-button');

    if (videoContainer && video) {
        videoContainer.addEventListener('click', () => {
            if (video.paused) {
                video.play(); // O navegador descarregará o vídeo agora devido ao preload="none"
                playBtn.style.opacity = '0';
            } else {
                video.pause();
                playBtn.style.opacity = '1';
            }
        });
    }

    // 7. Animações de Revelação (Intersection Observer super eficiente)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // 9. Lógica do Modal Pop-up para Jogos
    const gameModal = document.getElementById('game-modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalImg = document.getElementById('modal-img');
    const modalDesc = document.getElementById('modal-desc');

    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modalTitle.textContent = btn.dataset.title;
            modalImg.src = btn.dataset.image;
            modalDesc.textContent = btn.dataset.desc;

            gameModal.classList.remove('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            }, 10);

            lenis.stop();
            document.body.style.overflow = 'hidden';
        });
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
            gameModal.classList.add('opacity-0', 'pointer-events-none');

            lenis.start();
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !gameModal.classList.contains('opacity-0')) {
            document.querySelector('.close-modal').click();
        }
    });
});