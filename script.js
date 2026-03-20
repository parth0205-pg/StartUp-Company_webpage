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
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(e) {
            // 1. Close the mobile menu checkbox
            const menuToggle = document.getElementById('menu-toggle');
            if (menuToggle) menuToggle.checked = false;

            // 2. Check if the link is trying to scroll to a section on the SAME page (e.g., "#services-grid")
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault(); // Stop the browser's default instant jump
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    // Wait 150 milliseconds for the menu to visually close, THEN scroll smoothly
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 150);
                }
            }
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
// D SUBMISSIONS PAGE LOGIC (Backend Connected)
// =========================================

function renderSubmissions() {
    const container = document.getElementById("submissions-container");
    const btnDeleteAll = document.getElementById("btn-delete-all");
    
    if (!container) return;

    // Fetch data from MySQL via Spring Boot
    fetch("http://localhost:5055/api/contacts")
        .then(response => response.json())
        .then(savedContacts => {
            if (savedContacts.length === 0) {
                container.innerHTML = "<p style='text-align:center; width:100%; color: #777;'>No submissions found.</p>";
                if (btnDeleteAll) btnDeleteAll.style.display = "none";
            } else {
                if (btnDeleteAll) btnDeleteAll.style.display = "inline-block";
                container.innerHTML = ""; 
                
                savedContacts.forEach((contact, index) => {
                    // Notice we use contact.id now (from the database) instead of the array index
                    container.innerHTML += `
                        <div class="service-category reveal active" id="card-${index}">
                            <h3>${contact.name}</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li style="padding-left:0; margin-bottom:8px;"><strong>Email:</strong> ${contact.email}</li>
                                <li style="padding-left:0; margin-bottom:8px;"><strong>Phone:</strong> ${contact.phone}</li>
                                <li style="padding-left:0; margin-bottom:8px;"><strong>Country:</strong> ${contact.country}</li>
                                <li style="padding-left:0; margin-bottom:8px;"><strong>Message:</strong> ${contact.message}</li>
                                <li style="padding-left:0; margin-bottom:8px; color: var(--primary);">
                                    <strong><i class="fas fa-paperclip"></i> File:</strong> ${contact.fileName}
                                </li>
                            </ul>
                            <div class="card-actions" style="margin-top: 20px; display: flex; gap: 10px;">
                                <button onclick="downloadPDF(${index})" style="background: var(--primary); color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">PDF</button>
                                <button onclick="deleteSingleSubmission(${contact.id})" style="background: transparent; color: #ff4d4d; border: 1px solid #ff4d4d; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Delete</button>
                            </div>
                        </div>
                    `;
                });
            }
        });
}

// Global Function: Delete Single from Database
window.deleteSingleSubmission = function(id) {
    if (confirm("Delete this submission permanently?")) {
        fetch(`http://localhost:5055/api/contacts/${id}`, { method: "DELETE" })
            .then(() => renderSubmissions());
    }
};

// Global Function: Delete All from Database
window.deleteAllSubmissions = function() {
    if (confirm("WARNING: Delete ALL submissions from the database?")) {
        fetch("http://localhost:5055/api/contacts", { method: "DELETE" })
            .then(() => renderSubmissions());
    }
};

// Ensure cards render when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", renderSubmissions);


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

// --- TOAST NOTIFICATION FUNCTION ---
function showToast(message, isSuccess = true) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    
    // Reset classes
    toast.className = "show";
    if (isSuccess) {
        toast.classList.add("success");
    } else {
        toast.classList.add("error");
    }

    // Hide after 3.5 seconds
    setTimeout(function() { 
        toast.className = toast.className.replace("show", ""); 
    }, 3500);
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
    const justDialCodePattern = /^(\+\d{1,3}\s?)?$/;
    const validPhonePattern = /^(\+\d{1,3}\s?)?\d{10}$/;

    if (phone !== "" && !justDialCodePattern.test(phone)) {
        if (!validPhonePattern.test(phone)) {
            showError(phoneInput, "phone-error", "If provided, please enter exactly 10 digits.");
        }
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
        return false; 
    } else {
        // --- BACKEND MYSQL SUBMISSION LOGIC ---
        
        // 1. Bundle all data perfectly for Spring Boot
        const submitBtn = document.querySelector(".submit-btn");
        const originalBtnText = submitBtn.innerText;
        
        // Change UI to Loading state
        submitBtn.innerText = "Submitting...";
        submitBtn.disabled = true;

        const formData = new FormData();
        formData.append("name", nameInput.value.trim());
        formData.append("email", emailInput.value.trim());
        formData.append("phone", phoneInput.value.trim());
        formData.append("company", companyInput.value.trim()); // NEW COMPANY DATA
        formData.append("country", countryInput.value);
        formData.append("message", messageInput.value.trim());
        
        // 2. Attach the file if one exists
        const fileInput = document.getElementById('attachment');
        if (fileInput && fileInput.files.length > 0) {
            formData.append("attachment", fileInput.files[0]);
        }

        // 3. Send it to your Java Backend
        fetch("http://localhost:5055/api/contacts", {
            method: "POST",
            body: formData 
        })
        .then(response => {
            if (!response.ok) throw new Error("Server rejected request");
            
            // Show sleek success toast instead of alert
            showToast("Success! PitchTech will be in touch.", true);
            
            // Wait 2 seconds so the user can see the toast, then redirect
            setTimeout(() => {
                window.location.href = "submissions.html";
            }, 2000);
        })
        .catch(error => {
            console.error("Error:", error);
            // Show error toast
            showToast("Server error. Please try again later.", false);
            
            // Reset the button so they can try again
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
        
        return false;

    // =========================================
// 4. FETCH DATA FROM MYSQL (Submissions Page)
// =========================================
function fetchDatabaseSubmissions() {
    const container = document.getElementById("submissions-container");
    
    // Only run this if we are actually on the submissions.html page
    if (!container) return; 

    // Ask Spring Boot for the data
    fetch("http://localhost:5055/api/contacts")
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ""; // Clear the loading text
            
            if (data.length === 0) {
                container.innerHTML = "<p style='text-align:center; width:100%;'>No submissions in database yet.</p>";
                return;
            }

            // Loop through the MySQL rows and create HTML cards
            data.forEach(contact => {
                container.innerHTML += `
                    <div class="service-category reveal active">
                        <h3>${contact.name}</h3>
                        <p style="font-size: 0.85rem; color: #888; margin-top: -15px; margin-bottom: 15px;">
                            ID: ${contact.id} | ${contact.timestamp ? contact.timestamp.split('T')[0] : 'No Date'}
                        </p>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom:8px;"><strong>Email:</strong> ${contact.email}</li>
                            <li style="margin-bottom:8px;"><strong>Phone:</strong> ${contact.phone}</li>
                            <li style="margin-bottom:8px;"><strong>Country:</strong> ${contact.country}</li>
                            <li style="margin-bottom:8px;"><strong>Message:</strong> ${contact.message}</li>
                            <li style="margin-bottom:8px; color: var(--primary);">
                                <strong><i class="fas fa-paperclip"></i> File:</strong> ${contact.fileName || 'None'}
                            </li>
                        </ul>
                    </div>
                `;
            });
        })
        .catch(error => {
            container.innerHTML = "<p style='text-align:center; color:red;'>Failed to connect to backend database.</p>";
        });

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", fetchDatabaseSubmissions);

// Global Function: Download as PDF
window.downloadPDF = function(index) {
    // Grab the specific HTML card
    const element = document.getElementById(`card-${index}`);
    
    // Clone it so we don't accidentally delete the buttons on the real webpage
    const clone = element.cloneNode(true);
    const actionButtons = clone.querySelector('.card-actions');
    if (actionButtons) actionButtons.remove();

    // html2pdf configuration
    const opt = {
        margin:       0.5,
        filename:     `PitchTech_Submission.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 }, 
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate and save
    html2pdf().set(opt).from(clone).save();
};
}
}
}