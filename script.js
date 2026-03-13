// 1. Toggle the "Services" dropdown on mobile tap
        const servicesBtn = document.querySelector('.has-dropdown > a');
        const dropdownParent = document.querySelector('.has-dropdown');
        
        servicesBtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownParent.classList.toggle('open');
            }
        });

        // 2. Close the entire mobile menu when any normal link is clicked
        document.querySelectorAll('nav ul li a:not(.has-dropdown > a)').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('menu-toggle').checked = false;
            });
        });