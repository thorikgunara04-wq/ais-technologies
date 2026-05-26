// MAIN INTERACTION SCRIPT - AIS TECHNOLOGIES

// -------------------------------------------------------------
// 1. BILINGUAL LANGUAGE SWITCHER (ID/EN)
// -------------------------------------------------------------
function setLang(lang) {
    document.body.classList.toggle('lang-en', lang === 'en');
    
    // Manage active states on navbar buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const text = btn.textContent.trim().toUpperCase();
        btn.classList.toggle('active', text === lang.toUpperCase());
    });
}

// -------------------------------------------------------------
// 2. SCROLL REVEAL OBSERVER ANIMATIONS
// -------------------------------------------------------------
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // triggers slightly before entering
    });
    
    reveals.forEach(r => observer.observe(r));
}



// -------------------------------------------------------------
// 4. PARALLAX EFFECT FOR BACKGROUND GLOW
// -------------------------------------------------------------
function initAmbientParallax() {
    window.addEventListener('mousemove', (e) => {
        const glow1 = document.querySelector('.bg-glow-1');
        const glow2 = document.querySelector('.bg-glow-2');
        
        if (!glow1 || !glow2) return;
        
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        glow1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        glow2.style.transform = `translate(${-x * 40}px, ${-y * 40}px)`;
    });
}

// -------------------------------------------------------------
// INITIALIZATION ON READY
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
    initAmbientParallax();
});

// Bind setLang to global window context so inline buttons work
window.setLang = setLang;
