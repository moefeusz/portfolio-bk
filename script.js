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

    // Price comparison chart with intersection-triggered animation
    const market = [3000, 2000, 400, 150];
    const mine = [1200, 800, 160, 60];
    const canvas = document.getElementById('priceChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const labels = ['Strona WWW', 'Sklep online', 'Projekt logo', 'Wizytówka'];
        const chartData = {
            labels,
            datasets: [
                {
                    label: 'Rynek',
                    data: [0, 0, 0, 0],
                    backgroundColor: '#444444'
                },
                {
                    label: 'Twoja cena',
                    data: [0, 0, 0, 0],
                    backgroundColor: '#18d4c4'
                }
            ]
        };

        const priceChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                indexAxis: 'y',
                responsive: true,
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuad'
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    priceChart.data.datasets[0].data = market;
                    priceChart.data.datasets[1].data = mine;
                    priceChart.update();
                    obs.disconnect();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(canvas.closest('section'));
    }
});
