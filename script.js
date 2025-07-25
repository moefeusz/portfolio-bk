// Prosta interakcja: rozwijane menu i aktualny rok w stopce
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Ustaw aktualny rok w stopce
    document.getElementById('year').textContent = new Date().getFullYear();

    // Obsługa formularza
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Dziękuję za wysłanie wiadomości!');
        form.reset();
    });
});
