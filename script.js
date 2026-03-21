/* =========================================
   PITCHTECH MAIN JAVASCRIPT
   ========================================= */

// --- TOAST NOTIFICATION FUNCTION ---
function showToast(message, isSuccess = true) {
    const toast = document.getElementById("toast");
    if (!toast) return; // Failsafe if the toast div isn't on the page

    toast.textContent = message;
    toast.className = "show";
    
    if (isSuccess) {
        toast.classList.add("success");
    } else {
        toast.classList.add("error");
    }

    setTimeout(function() { 
        toast.className = toast.className.replace("show", ""); 
    }, 3500);
}

// =========================================
// 1. RUN ON PAGE LOAD (Event Listeners)
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // A. MOBILE MENU LOGIC
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(e) {
            const menuToggle = document.getElementById('menu-toggle');
            if (menuToggle) menuToggle.checked = false;

            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 150);
                }
            }
        });
    });

    // B. UX & ANIMATION LOGIC
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

    const elementsToAnimate = document.querySelectorAll('.feature-card, .service-card, .content-item, .info-item, .contact-wrapper, .mission-vision, .content-grid, .who-we-are, .service-category');
    elementsToAnimate.forEach(el => el.classList.add('reveal'));

    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const scrollObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); 
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => scrollObserver.observe(el));

    // C. DYNAMIC FORM FEATURES (Country Dropdown & Phone)
    const countrySelect = document.getElementById("country");
    const phoneInput = document.getElementById("phone");

    if (countrySelect && phoneInput) {
        populateCountries();

        const dialCodes = {
            "united-states": "+1", "united-kingdom": "+44", "canada": "+1",
            "germany": "+49", "india": "+91", "australia": "+61", "france": "+33",
            "japan": "+81", "brazil": "+55", "mexico": "+52", "china": "+86",
            "netherlands": "+31", "singapore": "+65", "spain": "+34",
            "italy": "+39", "south-korea": "+82", "other": "+"
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

    // Handle file attachment text
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
// 2. FORM VALIDATION & SUBMISSION
// =========================================
function validateForm() {
    let isValid = true; 
    let firstErrorInput = null; 

    // Get Inputs
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const companyInput = document.getElementById("company"); // Added Company
    const countryInput = document.getElementById("country");
    const messageInput = document.getElementById("message");

    // Get Values
    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const country = countryInput ? countryInput.value : "";
    const message = messageInput ? messageInput.value.trim() : "";

    function showError(inputElement, errorId, errorMessage) {
        document.getElementById(errorId).innerText = errorMessage;
        inputElement.classList.add("input-error");
        isValid = false; 
        if (!firstErrorInput) firstErrorInput = inputElement;
    }

    function clearErrors() {
        document.querySelectorAll(".error-message").forEach(span => span.innerText = ""); 
        document.querySelectorAll(".input-error").forEach(input => input.classList.remove("input-error")); 
    }

    clearErrors();
    
    // 1. Name Check
    if (name === "") showError(nameInput, "name-error", "Please enter your Name");

    // 2. Email Check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailPattern.test(email)) {
        showError(emailInput, "email-error", "Please enter a valid Email Address");
    }

    // 3. Strict Optional Phone Check
    const justDialCodePattern = /^(\+\d{1,3}\s?)?$/; 
    const validPhonePattern = /^(\+\d{1,3}\s?)?\d{10}$/; 
    
    if (phone !== "" && !justDialCodePattern.test(phone)) {
        if (!validPhonePattern.test(phone)) {
            showError(phoneInput, "phone-error", "If provided, please enter exactly 10 digits.");
        }
    }

    // 4. Country Check 
    if (country === "" || country === null) showError(countryInput, "country-error", "Please select a Country");

    // 5. Message Check
    if (message === "") showError(messageInput, "message-error", "Please enter a Description");

    // --- SUBMIT LOGIC ---
    if (!isValid) {
        firstErrorInput.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorInput.focus(); 
        return false; 
    } else {
        const submitBtn = document.querySelector(".submit-btn");
        const originalBtnText = submitBtn.innerText;
        
        // UI Feedback: Loading state
        submitBtn.innerText = "Submitting...";
        submitBtn.disabled = true;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        if (companyInput) formData.append("company", companyInput.value.trim()); // Send Company
        formData.append("country", country);
        formData.append("message", message);
        
        const fileInput = document.getElementById('attachment');
        if (fileInput && fileInput.files.length > 0) {
            formData.append("attachment", fileInput.files[0]);
        }

        // Send to Spring Boot (PORT 5055)
        fetch("http://localhost:5055/api/contacts", {
            method: "POST",
            body: formData 
        })
        .then(response => {
            if (!response.ok) throw new Error("Server rejected request");
            
            showToast("Success! PitchTech will be in touch.", true);
            
            setTimeout(() => {
                window.location.href = "submissions.html";
            }, 2000);
        })
        .catch(error => {
            console.error("Error:", error);
            showToast("Server error. Please try again later.", false);
            
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
        
        return false; // Crucial: Stops the native HTML refresh
    }
} // <--- THIS WAS THE MISSING BRACKET!


// =========================================
// 3. HELPER FUNCTIONS
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
// 4. SUBMISSIONS PAGE LOGIC (Backend Connected)
// =========================================
function renderSubmissions() {
    const container = document.getElementById("submissions-container");
    const btnDeleteAll = document.getElementById("btn-delete-all");
    
    if (!container) return;

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
                    container.innerHTML += `
                        <div class="service-category reveal active" id="card-${index}">
                            <h3>${contact.name} ${contact.company ? `<span style="font-size:0.9rem; color:#888;">(${contact.company})</span>` : ''}</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li style="padding-left:0; margin-bottom:8px;"><strong>Email:</strong> ${contact.email}</li>
                                <li style="padding-left:0; margin-bottom:8px;"><strong>Phone:</strong> ${contact.phone}</li>
                                <li style="padding-left:0; margin-bottom:8px;"><strong>Country:</strong> ${contact.country}</li>
                                <li style="padding-left:0; margin-bottom:8px;"><strong>Message:</strong> ${contact.message}</li>
                                <li style="padding-left:0; margin-bottom:8px; color: var(--primary);">
                                    <strong><i class="fas fa-paperclip"></i> File:</strong> ${contact.fileName || 'None'}
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

// Global Function: Download Custom Professional PDF
window.downloadPDF = function(index) {
    const element = document.getElementById(`card-${index}`);
    const clone = element.cloneNode(true);
    const actionButtons = clone.querySelector('.card-actions');
    if (actionButtons) actionButtons.remove();

    const opt = {
        margin:       0.5,
        filename:     `PitchTech_Submission.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 }, 
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(clone).save();
};

document.addEventListener("DOMContentLoaded", renderSubmissions);