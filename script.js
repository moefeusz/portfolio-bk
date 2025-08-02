// Basic interactions: set current year, handle contact form submission and category filtering
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Handle contact form submission
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Dziękuję za wysłanie wiadomości!');
            form.reset();
        });
    }

    // Category filtering for projects
    const categoryButtons = document.querySelectorAll('.category-btn');
    const projectCards = document.querySelectorAll('.project-card');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            // Highlight active button
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Filter projects
            projectCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || category === cardCat) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // Aftercare modal logic
    const aftercareBtn = document.getElementById('aftercare-btn');
    const aftercareModal = document.getElementById('aftercare-modal');
    const aftercareClose = document.getElementById('aftercare-close');
    const aftercareForm = document.getElementById('aftercare-form');

    if (aftercareBtn && aftercareModal && aftercareClose) {
        aftercareBtn.addEventListener('click', () => {
            aftercareModal.classList.add('show');
        });

        aftercareClose.addEventListener('click', () => {
            aftercareModal.classList.remove('show');
        });

        aftercareModal.addEventListener('click', (e) => {
            if (e.target === aftercareModal) {
                aftercareModal.classList.remove('show');
            }
        });
    }

    if (aftercareForm) {
        aftercareForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Dziękuję! Wkrótce się skontaktuję.');
            aftercareForm.reset();
            aftercareModal.classList.remove('show');
        });
    }
});
