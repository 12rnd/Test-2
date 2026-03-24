document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursor = document.getElementById('cursor');
    const interactiveElements = document.querySelectorAll('a, button, .menu-toggle, .work-item, .close-menu');

    // Only enable custom cursor if it's not a touch device
    if (window.matchMedia("(pointer: fine)").matches && cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
            });
        });
    }

    // 2. Overlay Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const overlayMenu = document.getElementById('overlay-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    const toggleMenu = () => {
        if (!overlayMenu) return;
        
        overlayMenu.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (overlayMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            // Restore overflow but keep overflow-x hidden as per CSS
            document.body.style.overflow = '';
            document.body.style.overflowX = 'hidden';
        }
    };

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (closeMenu) closeMenu.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 3. Scroll Animations using Intersection Observer
    const slideInElements = document.querySelectorAll('.slide-in, .reveal-item');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                // Stop observing once revealed so animation only plays once
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    slideInElements.forEach(el => {
        revealOnScroll.observe(el);
    });
});
