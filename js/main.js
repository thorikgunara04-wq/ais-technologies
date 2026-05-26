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
// 3. MODERN AI WIDGET ASSISTANT CHATBOT CLIENT
// -------------------------------------------------------------
function initChatbotWidget() {
    const chatWidget = document.getElementById('chat-widget');
    const chatHeader = document.getElementById('chat-header');
    const toggleIcon = document.getElementById('chat-toggle-icon');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatBody = document.getElementById('chat-body');
    
    if (!chatWidget || !chatHeader || !chatSend || !chatInput || !chatBody) return;
    
    // Toggle Minimize/Maximize
    chatHeader.addEventListener('click', () => {
        chatWidget.classList.toggle('minimized');
        if (chatWidget.classList.contains('minimized')) {
            toggleIcon.innerText = '▲';
        } else {
            toggleIcon.innerText = '▼';
            chatInput.focus();
            
            // Auto scroll to bottom when opening
            setTimeout(() => {
                chatBody.scrollTop = chatBody.scrollHeight;
            }, 100);
        }
    });
    
    // Send Message Event
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        // Append user message bubble
        chatBody.innerHTML += `<div class="msg user-msg">${text}</div>`;
        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;
        
        // Append simulated typing indicator
        const typingId = 'typing-' + Date.now();
        chatBody.innerHTML += `
            <div class="msg ai-msg" id="${typingId}" style="font-style: italic; opacity: 0.7;">
                AIS Agent mengetik...
            </div>
        `;
        chatBody.scrollTop = chatBody.scrollHeight;
        
        try {
            // Fetch Vercel serverless Python endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            
            const typingBubble = document.getElementById(typingId);
            if (typingBubble) typingBubble.remove();
            
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            
            const data = await response.json();
            
            // Append AI response bubble
            chatBody.innerHTML += `<div class="msg ai-msg">${data.response}</div>`;
        } catch (err) {
            console.error("Chat API Error:", err);
            const typingBubble = document.getElementById(typingId);
            if (typingBubble) typingBubble.remove();
            
            chatBody.innerHTML += `
                <div class="msg ai-msg" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.2);">
                    Error: Gagal terhubung ke AIS Engine di Vercel, Bro. Pastikan server aktif!
                </div>
            `;
        }
        
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // Trigger on send click
    chatSend.addEventListener('click', sendMessage);
    
    // Trigger on Enter key
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
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
    initChatbotWidget();
    initAmbientParallax();
});

// Bind setLang to global window context so inline buttons work
window.setLang = setLang;
