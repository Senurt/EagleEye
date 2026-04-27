document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content');
    
    // Initial state
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateX(-20px)';
    heroContent.style.transition = 'all 0.8s ease-out';

    // Fade and slide in
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateX(0)';
    }, 400);

    console.log("Eagle Eye Home: Satellite View Online.");
});

document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content');
    const menuBtn = document.getElementById('menuBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    // Existing Hero Animation
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateX(-20px)';
    heroContent.style.transition = 'all 0.8s ease-out';

    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateX(0)';
    }, 400);

    // Toggle Dropdown
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking anywhere else on the screen
    document.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
        }
    });

    console.log("Eagle Eye Home: Satellite View Online.");
});