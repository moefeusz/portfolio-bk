import { pricingData } from './pricing-data.js';

// Basic interactions: set current year, handle contact form submission, category filtering and pricing table
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

    // Populate pricing table
    const pricingTableBody = document.querySelector('#pricing-table tbody');
    if (pricingTableBody) {
        pricingData.forEach(item => {
            const row = document.createElement('tr');
            [item.plan, item.price, item.quote].forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                row.appendChild(td);
            });
            pricingTableBody.appendChild(row);
        });
    }
});
