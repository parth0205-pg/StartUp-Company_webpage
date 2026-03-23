// 1. smooth scroll function

document.addEventListener("DOMContentLoaded", function() {
    
    // A. For mobile menu
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

    // B. for scroll animation
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

    // C. auto selection country wise phone digit 
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

    // for file attachment text
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
    renderSubmissions();
});

// 2. form validation & submit
function validateForm() {
    let isValid = true; 
    let firstErrorInput = null; 

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const companyInput = document.getElementById("company"); 
    const countryInput = document.getElementById("country");
    const messageInput = document.getElementById("message");

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
    
    if (name === "") showError(nameInput, "name-error", "Please enter your Name");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" || !emailPattern.test(email)) {
        showError(emailInput, "email-error", "Please enter a valid Email Address");
    }

    const justDialCodePattern = /^(\+\d{1,3}\s?)?$/; 
    const validPhonePattern = /^(\+\d{1,3}\s?)?\d{10}$/; 
    if (phone !== "" && !justDialCodePattern.test(phone)) {
        if (!validPhonePattern.test(phone)) {
            showError(phoneInput, "phone-error", "If provided, please enter exactly 10 digits.");
        }
    }

    if (country === "" || country === null) showError(countryInput, "country-error", "Please select a Country");
    if (message === "") showError(messageInput, "message-error", "Please enter a Description");

    if (!isValid) {
        firstErrorInput.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorInput.focus(); 
        return false; 
    } else {
        const submitBtn = document.querySelector(".submit-btn");
        const originalBtnText = submitBtn.innerText;
        
        submitBtn.innerText = "Submitting...";
        submitBtn.disabled = true;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        if (companyInput) formData.append("company", companyInput.value.trim()); 
        formData.append("country", country);
        formData.append("message", message);
        
        const fileInput = document.getElementById('attachment');
        if (fileInput && fileInput.files.length > 0) {
            formData.append("attachment", fileInput.files[0]);
        }

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
        
        return false; 
    }
}

// 3. country selection logic
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

// 4. SUBMISSIONS PAGE LOGIC
let adminAuthToken = "";

function getAdminAuth() {
    if (!adminAuthToken) {
        const username = prompt("Admin Locked. Enter Username (Hint: pitchtech_admin):");
        if (username === null) return false; 
        
        const password = prompt("Enter Password (Hint: secure123):");
        if (password === null) return false;

        adminAuthToken = "Basic " + btoa(username + ":" + password);
    }
    return adminAuthToken;
}

function renderSubmissions() {
    const container = document.getElementById("submissions-container");
    const btnDeleteAll = document.getElementById("btn-delete-all");
    
    if (!container) return; 

    const token = getAdminAuth();
    if (!token) {
        container.innerHTML = "<p style='text-align:center; color:red;'>Access Denied. Reload page to log in.</p>";
        return;
    }

    fetch("http://localhost:5055/api/contacts", {
        headers: { "Authorization": token }
    })
    .then(response => {
        if (!response.ok) {
            adminAuthToken = ""; 
            throw new Error("Invalid Credentials");
        }
        return response.json();
    })
    .then(savedContacts => {
        window.submissionsData = savedContacts; 

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
    })
    .catch(error => {
        console.error(error);
        alert("Authentication Failed or Server Offline.");
        container.innerHTML = "<p style='text-align:center; color:red;'>Access Denied or Backend not running.</p>";
    });
}

window.deleteSingleSubmission = function(id) {
    if (confirm("Delete this submission permanently?")) {
        fetch(`http://localhost:5055/api/contacts/${id}`, { 
            method: "DELETE",
            headers: { "Authorization": adminAuthToken }
        }).then(() => renderSubmissions());
    }
};

window.deleteAllSubmissions = function() {
    if (confirm("WARNING: Delete ALL submissions from the database?")) {
        fetch("http://localhost:5055/api/contacts", { 
            method: "DELETE",
            headers: { "Authorization": adminAuthToken }
        }).then(() => renderSubmissions());
    }
};

window.downloadPDF = async function(index) {
    const contact = window.submissionsData[index];
    if (!contact) return;

    const cardElement = document.getElementById(`card-${index}`);
    const pdfBtn = cardElement.querySelector('button');
    const originalBtnText = pdfBtn.innerHTML;
    pdfBtn.innerHTML = "Generating...";
    pdfBtn.disabled = true;

    const refId = "PT-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    const submitDate = contact.timestamp ? contact.timestamp.split('T')[0] : new Date().toLocaleDateString();
    const formattedCountry = contact.country ? contact.country.replace('-', ' ').toUpperCase() : 'N/A';

    try {
        const response = await fetch('pdf-template.html');
        if (!response.ok) throw new Error("Could not load PDF template");
        let templateHtml = await response.text();

        templateHtml = templateHtml
            .replace('{{DATE}}', submitDate)
            .replace('{{REF_ID}}', refId)
            .replace('{{NAME}}', contact.name)
            .replace('{{COMPANY}}', contact.company || 'Not Provided')
            .replace('{{EMAIL}}', contact.email)
            .replace('{{PHONE}}', contact.phone || 'Not Provided')
            .replace('{{COUNTRY}}', formattedCountry)
            .replace('{{FILE}}', contact.fileName || 'None')
            .replace('{{MESSAGE}}', contact.message);

        const container = document.createElement('div');
        container.innerHTML = templateHtml;d

        const opt = {
            margin:       [0, 0, 0.5, 0], 
            filename:     `PitchTech_form${contact.name.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 2, useCORS: true }, 
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(container).save();

    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate PDF. Make sure your local server is running.");
    } finally {
        pdfBtn.innerHTML = originalBtnText;
        pdfBtn.disabled = false;
    }

    // form successful pop up message
function showToast(message, isSuccess = true) {
    const toast = document.getElementById("toast");
    if (!toast) return;

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
};