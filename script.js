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

    // Pricing chart
    const pricingCanvas = document.getElementById('pricingChart');
    if (pricingCanvas && window.Chart) {
        new Chart(pricingCanvas, {
            type: 'bar',
            data: {
                labels: ['Pakiet A', 'Pakiet B', 'Pakiet C'],
                datasets: [{
                    label: 'Cena (PLN)',
                    data: [1000, 2000, 3000],
                    backgroundColor: 'rgba(0,255,128,0.5)',
                    borderColor: 'rgba(0,255,128,1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
