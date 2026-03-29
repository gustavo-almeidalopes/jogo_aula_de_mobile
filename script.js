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

    let winHeight = window.innerHeight;
    let sobreOffset = document.getElementById('sobre')?.offsetTop || 0;
    const universoSection = document.getElementById('universo');
    let universoTop = universoSection?.offsetTop || 0;
    let universoHeight = universoSection?.offsetHeight || 0;

    window.addEventListener('resize', () => {
        winHeight = window.innerHeight;
        if (document.getElementById('sobre')) sobreOffset = document.getElementById('sobre').offsetTop;
        if (universoSection) {
            setTimeout(() => { // Aguardar possível recálculo do layout (Ex: Mobile para Desktop)
                universoTop = universoSection.offsetTop;
                universoHeight = universoSection.offsetHeight;
            }, 100);
        }
    });

    // 2. Cursor Customizado (Apenas em Desktop)
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
            cursor.style.transform = `translate3d(${mouseX - 5}px, ${mouseY - 5}px, 0)`;
        }, { passive: true });

        function animateCursor() {
            followerX += (mouseX - followerX) * 0.2;
            followerY += (mouseY - followerY) * 0.2;
            cursorFollower.style.transform = `translate3d(${followerX - 15}px, ${followerY - 15}px, 0)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        magneticBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            btn.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // 3. Controlo de Tema (Completamente Reparado!)
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

    // 5. Parallax e Scroll Horizontal (Agora também para Mobile!)
    const heroScrollImage = document.getElementById('hero-scroll-image');
    const navbar = document.getElementById('navbar');
    const cards = document.querySelectorAll('.lore-card');
    const dots = document.querySelectorAll('.timeline-dot');

    lenis.on('scroll', (e) => {
        const scrollY = e.scroll;

        if (heroScrollImage && sobreOffset > 0) {
            const progress = Math.min(Math.max(scrollY / sobreOffset, 0), 1);
            const rotation = -(progress * 225);
            const scale = 1 + (Math.pow(progress, 3) * 7);
            const translateY = progress * (winHeight * 0.45);
            heroScrollImage.style.transform = `translate3d(0, ${translateY}px, 0) rotate(${rotation}deg) scale(${scale})`;
        }

        if (scrollY > 50) {
            navbar.classList.add('bg-white/80', 'dark:bg-[#050505]/80', 'backdrop-blur-xl', 'border-gray-200', 'dark:border-white/10', 'py-4');
            navbar.classList.remove('border-transparent', 'py-6');
        } else {
            navbar.classList.remove('bg-white/80', 'dark:bg-[#050505]/80', 'backdrop-blur-xl', 'border-gray-200', 'dark:border-white/10', 'py-4');
            navbar.classList.add('border-transparent', 'py-6');
        }

        // Removido o bloqueio do window.innerWidth daqui para funcionar no mobile!
        if (cards.length > 0 && universoTop > 0) {
            const progress = Math.max(0, Math.min(1, (scrollY - universoTop) / (universoHeight - winHeight)));
            const totalCards = cards.length;
            
            // Lógica de "Horizontal Track" (Scroll Horizontal Puro estilo Lando Norris)
            const cardWidth = window.innerWidth;
            const maxTranslate = cardWidth * (totalCards - 1);

            cards.forEach((card, index) => {
                const initialX = index * cardWidth;
                let x = initialX - (progress * maxTranslate);
                card.style.opacity = 1;
                card.style.transform = `translate3d(${x}px, 0px, 0)`;
                card.style.zIndex = 10;
            });

            // Sincronizar os pontos do timeline com o card focado
            const activeIndex = Math.min(totalCards - 1, Math.max(0, Math.round(progress * (totalCards - 1))));
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.style.backgroundColor = '#ff3366';
                    dot.style.transform = `translateZ(0) scale(1.5)`;
                } else {
                    dot.style.backgroundColor = '';
                    dot.style.transform = `translateZ(0) scale(1)`;
                }
            });
        }
    });

    // 6. Vídeo
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('gameplay-video');
    const playBtn = document.getElementById('play-button');

    if (videoContainer && video) {
        videoContainer.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playBtn.style.opacity = '0';
            } else {
                video.pause();
                playBtn.style.opacity = '1';
            }
        });
    }

    // 7. Novas Animações de Revelação Estilo Lando Norris
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // 8. Modal Jogos
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
