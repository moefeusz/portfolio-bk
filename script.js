// Basic interactions: set current year and handle contact form submission
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Handle contact form
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Dziękuję za wysłanie wiadomości!');
        form.reset();
    });
});
