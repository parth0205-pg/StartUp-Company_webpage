/* =========================================
   PITCHTECH MAIN JAVASCRIPT
   ========================================= */

// =========================================
// 1. RUN ON PAGE LOAD (Event Listeners)
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // =========================================
    // A. MOBILE MENU LOGIC (Runs on all pages)
    // =========================================
    const servicesBtn = document.querySelector('.has-dropdown > a');
    const dropdownParent = document.querySelector('.has-dropdown');
    
    // 1. Toggle the "Services" dropdown on mobile tap
    if (servicesBtn && dropdownParent) {
        servicesBtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownParent.classList.toggle('open');
            }
        });
    }

    // 2. Close the entire mobile menu when any normal link is clicked
    document.querySelectorAll('nav ul li a:not(.has-dropdown > a)').forEach(link => {
        link.addEventListener('click', () => {
            const menuToggle = document.getElementById('menu-toggle');
            if (menuToggle) menuToggle.checked = false;
        });
    });


    // =========================================
    // B. UX & ANIMATION LOGIC (Runs on all pages)
    // =========================================

    // --- 1. Sticky Header Shrink ---
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Smart Scroll Reveal ---
    const elementsToAnimate = document.querySelectorAll('.feature-card, .service-card, .content-item, .info-item, .contact-wrapper, .mission-vision, .content-grid, .who-we-are, .service-category');
    
    elementsToAnimate.forEach(el => el.classList.add('reveal'));

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); 
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        scrollObserver.observe(el);
    });

    // --- 3. Active Navigation Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a:not(.nav-contact-btn)');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href').includes(currentSectionId) && currentSectionId !== "") {
                link.classList.add('active-link');
            }
        });
    });


    // =========================================
    // C. DYNAMIC FORM FEATURES (Runs ONLY on Contact Page)
    // =========================================
    const countrySelect = document.getElementById("country");
    const phoneInput = document.getElementById("phone");

    // Populate the country dropdown and setup dial codes ONLY if the dropdown exists
    if (countrySelect && phoneInput) {
        populateCountries();

        const dialCodes = {
            "united-states": "+1",
            "united-kingdom": "+44",
            "canada": "+1",
            "germany": "+49",
            "india": "+91",
            "australia": "+61",
            "france": "+33",
            "japan": "+81",
            "brazil": "+55",
            "mexico": "+52",
            "china": "+86",
            "netherlands": "+31",
            "singapore": "+65",
            "spain": "+34",
            "italy": "+39",
            "south-korea": "+82",
            "other": "+"
        };

        countrySelect.addEventListener("change", function() {
            const selectedCountry = this.value; 
            
            if (dialCodes[selectedCountry]) {
                phoneInput.value = dialCodes[selectedCountry] + " "; 
                phoneInput.classList.remove("input-error"); 
                document.getElementById("phone-error").innerText = "";
            }
        });
    }

    // Handle file attachment text update
    const fileInput = document.getElementById('attachment');
    const fileChosenText = document.getElementById('file-chosen');

    if (fileInput && fileChosenText) {
        fileInput.addEventListener('change', function() {
            if(this.files && this.files.length > 0) {
                fileChosenText.textContent = this.files[0].name;
                fileChosenText.style.color = '#555'; 
            } else {
                fileChosenText.textContent = "No File Chosen";
                fileChosenText.style.color = '#888';
            }
        });
    }
});


// =========================================
// 2. DYNAMIC CONTENT FUNCTIONS
// =========================================
function populateCountries() {
    const countrySelect = document.getElementById("country");
    
    const countries = [
        "United States", "United Kingdom", "Canada", "Germany", "India", 
        "Australia", "France", "Japan", "Brazil", "Mexico", "China", 
        "Netherlands", "Singapore", "Spain", "Italy", "South Korea"
    ];

    countries.sort();
    countries.push("Other");

    countries.forEach(function(countryName) {
        const option = document.createElement("option");
        option.text = countryName;
        option.value = countryName.toLowerCase().replace(/\s+/g, '-'); 
        countrySelect.add(option);
    });
}


// =========================================
// 3. FORM VALIDATION
// =========================================
function validateForm() {
    let isValid = true; 
    let firstErrorInput = null; 

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const countryInput = document.getElementById("country");
    const messageInput = document.getElementById("message");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const country = countryInput.value;
    const message = messageInput.value.trim();

    function showError(inputElement, errorId, errorMessage) {
        document.getElementById(errorId).innerText = errorMessage;
        inputElement.classList.add("input-error");
        isValid = false; 
        
        if (!firstErrorInput) {
            firstErrorInput = inputElement;
        }
    }

    function clearErrors() {
        const errorTexts = document.querySelectorAll(".error-message");
        errorTexts.forEach(span => span.innerText = ""); 
        
        const errorInputs = document.querySelectorAll(".input-error");
        errorInputs.forEach(input => input.classList.remove("input-error")); 
    }

    clearErrors();
    
    // Name Check
    if (name === "") {
        showError(nameInput, "name-error", "Please enter your Name");
    }

    // Email Check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailPattern.test(email)) {
        showError(emailInput, "email-error", "Please enter a valid Email Address");
    }

    // Phone Check
    const phonePattern = /^(\+\d{1,3}\s?)?\d{10}$/;
    if (phone === "" || phone === "+") {
        showError(phoneInput, "phone-error", "Please enter your Phone Number");
    } else if (!phonePattern.test(phone)) {
        showError(phoneInput, "phone-error", "Please enter a valid 10-digit number after the country code");
    }

    // Country Check 
    if (country === "" || country === null) {
        showError(countryInput, "country-error", "Please select a Country");
    }

    // Message Check
    if (message === "") {
        showError(messageInput, "message-error", "Please enter a Description");
    }

    if (!isValid) {
        firstErrorInput.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorInput.focus(); 
    } else {
        alert("Form submitted successfully! PitchTech will be in touch."); 
    }

    return isValid; 
}