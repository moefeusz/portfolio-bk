// script.js – behaviour for the portfolio demo

document.addEventListener('DOMContentLoaded', () => {
    /* ---------------------------------------------------------------------
     * Typed text animation in the hero section
     * Rotates through a set of job titles to show versatility.
     */
    const typedElement = document.getElementById('typed-text');
    const roles = ['Front‑end Developer', '3D Designer', 'JavaScript Magician', 'UI/UX Enthusiast'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        if (!isDeleting) {
            // Add one character at a time
            typedElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentRole.length) {
                // Pause at full text, then start deleting
                isDeleting = true;
                setTimeout(type, 1500);
                return;
            }
        } else {
            // Delete characters
            typedElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                // Move to next role and start typing again
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }
        // Speed up deletion slightly
        const delay = isDeleting ? 50 : 120;
        setTimeout(type, delay);
    }
    type();

    /* ---------------------------------------------------------------------
     * Scroll-triggered animations
     * Sections and cards fade in when they enter the viewport.
     */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    document.querySelectorAll('.section, .card, .project-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    /* ---------------------------------------------------------------------
     * Projects filtering
     * Show or hide project cards based on selected category.
     */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ---------------------------------------------------------------------
     * Hack the Code game
     * User must guess a random 5‑digit code or trigger an easter egg.
     */
    // Generate a random 5‑character alphanumeric code
    function generateCode() {
        // Generate a random alphanumeric string and take the first 5 characters
        return Math.random().toString(36).substring(2, 7).toLowerCase();
    }
    let accessCode = generateCode();
    let attemptsLeft = 3;
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');
    const button = document.getElementById('terminal-btn');
    const confettiContainer = document.getElementById('confetti-container');

    function printLine(text, color = '#33ff88') {
        const line = document.createElement('div');
        line.style.color = color;
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function resetGame() {
        // reset code and attempts
        accessCode = generateCode();
        attemptsLeft = 3;
    }

    function handleGuess() {
        const guess = input.value.trim();
        if (!guess) return;
        printLine('> ' + guess, varColor('#00e6b8'));
        input.value = '';
        // Easter egg trigger
        if (guess.toLowerCase() === 'konki') {
            printLine('🎉 Wygrałeś talon na kurwę i balon! 🎈', '#ff66cc');
            // speak message after slight pause
            setTimeout(() => {
                const utter = new SpeechSynthesisUtterance('Wygrałeś talon na kurwę i balon');
                speechSynthesis.speak(utter);
                launchConfetti();
            }, 1000);
            resetGame();
            return;
        }
        // Validate input for a 5‑character alphanumeric code
        if (!/^[a-zA-Z0-9]{5}$/.test(guess)) {
            printLine('Wprowadź 5‑znakowy kod (litery i cyfry).', '#ff4444');
            return;
        }
        if (guess.toLowerCase() === accessCode) {
            printLine('Access Granted! ✅', '#66ff66');
            printLine('Kod został złamany.', '#66ff66');
            resetGame();
            return;
        } else {
            attemptsLeft--;
            printLine(`Błędny kod. Pozostało prób: ${attemptsLeft}`, '#ffaa00');
            if (attemptsLeft <= 0) {
                printLine('Access Denied! ❌ Kod zresetowany.', '#ff4444');
                resetGame();
            }
            // Humorous random denial messages
            const messages = [
                'System mówi: pij se mleko, bo kodu nie znasz',
                'Error 404: Twój mózg nie został znaleziony',
                'To nie kurna Totolotek, wpisz normalny kod',
                'Nie tak szybko, padawanie, spróbuj jeszcze raz!'
            ];
            if (Math.random() < 0.5) {
                const msg = messages[Math.floor(Math.random() * messages.length)];
                printLine(msg, '#8888ff');
            }
        }
    }

    // Launch confetti effect
    function launchConfetti() {
        // Remove any existing confetti
        confettiContainer.innerHTML = '';
        const colors = ['#00e6b8', '#8c73ff', '#ff66cc', '#66ff66', '#ffaa00'];
        const count = 100;
        for (let i = 0; i < count; i++) {
            const confetto = document.createElement('span');
            confetto.classList.add('confetto');
            const color = colors[Math.floor(Math.random() * colors.length)];
            confetto.style.backgroundColor = color;
            confetto.style.left = Math.random() * 100 + '%';
            confetto.style.animationDelay = (Math.random() * 0.5) + 's';
            confettiContainer.appendChild(confetto);
        }
        // Remove confetti after animation ends
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 4000);
    }

    // Confetti CSS injection
    const style = document.createElement('style');
    style.textContent = `
        #confetti-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 999;
        }
        .confetto {
            position: absolute;
            width: 8px;
            height: 8px;
            opacity: 0.9;
            animation-name: confetti-fall;
            animation-duration: 3s;
            animation-timing-function: ease-out;
            animation-iteration-count: 1;
        }
        @keyframes confetti-fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Helper to ensure colour variables accessible in code messages
    function varColor(color) {
        return color;
    }

    button.addEventListener('click', handleGuess);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });
    // Initial prompt
    printLine('System locked. Wprowadź 5‑znakowy kod dostępu.');

    /* ---------------------------------------------------------------------
     * Contact form submission
     */
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Dziękuję za wiadomość! Odezwiemy się wkrótce.');
        contactForm.reset();
    });
});