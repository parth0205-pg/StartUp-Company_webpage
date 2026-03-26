/* =========================================
   PITCHTECH MAIN JAVASCRIPT
   ========================================= */

// --- GLOBAL TOAST FUNCTION ---
function showToast(message, isSuccess = true) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = "show";
    if (isSuccess) toast.classList.add("success");
    else toast.classList.add("error");
    setTimeout(function() { toast.className = toast.className.replace("show", ""); }, 3500);
}

// =========================================
// 1. RUN ON PAGE LOAD
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // Smooth Scrolling & Mobile Menu
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(e) {
            const menuToggle = document.getElementById('menu-toggle');
            if (menuToggle) menuToggle.checked = false;
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) setTimeout(() => { targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 150);
            }
        });
    });

    // Scroll Animations
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }
    const elementsToAnimate = document.querySelectorAll('.feature-card, .service-card, .content-item, .info-item, .contact-wrapper, .mission-vision, .content-grid, .who-we-are, .service-category');
    elementsToAnimate.forEach(el => el.classList.add('reveal'));
    const scrollObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.reveal').forEach(el => scrollObserver.observe(el));

    // Dynamic Form Features
    const countrySelect = document.getElementById("country");
    const phoneInput = document.getElementById("phone");
    if (countrySelect && phoneInput) {
        const countries = ["United States", "United Kingdom", "Canada", "Germany", "India", "Australia", "France", "Japan", "Brazil", "Mexico", "China", "Netherlands", "Singapore", "Spain", "Italy", "South Korea"];
        countries.sort().push("Other");
        countries.forEach(function(c) {
            let opt = document.createElement("option"); opt.text = c; opt.value = c.toLowerCase().replace(/\s+/g, '-');
            countrySelect.add(opt);
        });

        const dialCodes = { "united-states": "+1", "united-kingdom": "+44", "canada": "+1", "germany": "+49", "india": "+91", "australia": "+61", "france": "+33", "japan": "+81", "brazil": "+55", "mexico": "+52", "china": "+86", "netherlands": "+31", "singapore": "+65", "spain": "+34", "italy": "+39", "south-korea": "+82", "other": "+" };
        countrySelect.addEventListener("change", function() {
            if (dialCodes[this.value]) {
                phoneInput.value = dialCodes[this.value] + " "; 
                phoneInput.classList.remove("input-error"); 
                document.getElementById("phone-error").innerText = "";
            }
        });
    }

    const fileInput = document.getElementById('attachment');
    const fileChosenText = document.getElementById('file-chosen');
    if (fileInput && fileChosenText) {
        fileInput.addEventListener('change', function() {
            if(this.files && this.files.length > 0) {
                fileChosenText.textContent = this.files[0].name; fileChosenText.style.color = '#555'; 
            } else {
                fileChosenText.textContent = "No File Chosen"; fileChosenText.style.color = '#888';
            }
        });
    }

    // Auto-trigger rendering based on which page we are on
    if (document.getElementById("submissions-container")) renderUserSubmissions();
});

// =========================================
// 2. FORM VALIDATION & DUAL SUBMISSION
// =========================================
function validateForm() {
    let isValid = true; let firstErrorInput = null; 
    const nameInput = document.getElementById("name"); const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone"); const companyInput = document.getElementById("company"); 
    const countryInput = document.getElementById("country"); const messageInput = document.getElementById("message");
    const fileInput = document.getElementById('attachment'); // Grab file input

    const name = nameInput ? nameInput.value.trim() : ""; const email = emailInput ? emailInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : ""; const country = countryInput ? countryInput.value : "";
    const message = messageInput ? messageInput.value.trim() : "";

    function showError(input, id, msg) { document.getElementById(id).innerText = msg; input.classList.add("input-error"); isValid = false; if (!firstErrorInput) firstErrorInput = input; }
    document.querySelectorAll(".error-message").forEach(span => span.innerText = ""); 
    document.querySelectorAll(".input-error").forEach(input => input.classList.remove("input-error")); 
    
    if (name === "") showError(nameInput, "name-error", "Please enter your Name");
    if (email === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) showError(emailInput, "email-error", "Please enter a valid Email");
    if (phone !== "" && !/^(\+\d{1,3}\s?)?$/.test(phone)) if (!/^(\+\d{1,3}\s?)?\d{10}$/.test(phone)) showError(phoneInput, "phone-error", "If provided, please enter exactly 10 digits.");
    if (country === "" || country === null) showError(countryInput, "country-error", "Please select a Country");
    if (message === "") showError(messageInput, "message-error", "Please enter a Description");

    // NEW: 10MB File Size Check
    let fileName = 'None';
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 10 * 1024 * 1024) { // 10MB in bytes
            showError(fileInput, "file-error", "File is too large. Maximum size is 10MB.");
        } else {
            fileName = file.name;
        }
    }

    if (!isValid) {
        firstErrorInput.scrollIntoView({ behavior: "smooth", block: "center" }); firstErrorInput.focus(); return false; 
    } else {
        const submitBtn = document.querySelector(".submit-btn"); const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Submitting..."; submitBtn.disabled = true;

        const formData = new FormData();
        formData.append("name", name); formData.append("email", email); formData.append("phone", phone);
        if (companyInput) formData.append("company", companyInput.value.trim()); 
        formData.append("country", country); formData.append("message", message);
        if (fileInput && fileInput.files.length > 0) formData.append("attachment", fileInput.files[0]);

        fetch("http://localhost:5055/api/contacts", { method: "POST", body: formData })
        .then(async response => {
            if (!response.ok) throw new Error("Server rejected request");
            
            // Grab the timestamped filename sent from Spring Boot!
            const serverFileName = await response.text(); 
            
            const userCopy = {
                name: name, email: email, phone: phone || 'N/A',
                company: companyInput ? companyInput.value.trim() || 'N/A' : 'N/A',
                country: country, message: message, 
                fileName: serverFileName, // Use the real server filename
                timestamp: new Date().toISOString()
            };
            let localData = JSON.parse(localStorage.getItem("pitchtech_user_forms")) || [];
            localData.push(userCopy);
            localStorage.setItem("pitchtech_user_forms", JSON.stringify(localData));

            showToast("Success! PitchTech will be in touch.", true);
            setTimeout(() => { window.location.href = "submissions.html"; }, 2000);
        })
        .catch(error => {
            console.error(error); showToast("Server error. Please try again later.", false);
            submitBtn.innerText = originalBtnText; submitBtn.disabled = false;
        });
        return false; 
    }
}

// =========================================
// 3. USER SUBMISSIONS PAGE (Local Data)
// =========================================
function renderUserSubmissions() {
    const container = document.getElementById("submissions-container");
    if (!container) return; 

    const localData = JSON.parse(localStorage.getItem("pitchtech_user_forms")) || [];
    window.submissionsData = localData; 

    if (localData.length === 0) {
        container.innerHTML = "<p style='text-align:center; width:100%; color: #777;'>You have not submitted any inquiries yet.</p>";
    } else {
        container.innerHTML = ""; 
        localData.forEach((contact, index) => {
            
            // Clean Fallbacks
            const companyText = (contact.company && contact.company !== 'Not submitted') ? contact.company : 'N/A';
            const phoneText = (contact.phone && contact.phone !== 'Not submitted') ? contact.phone : 'N/A';
            
            // Clickable file link without credentials
            let fileDisplay = '<span style="color:#aaa;">No file attached</span>';
            if (contact.fileName && contact.fileName !== 'No file attached' && contact.fileName !== 'None') {
                const originalName = contact.fileName.substring(contact.fileName.indexOf('_') + 1);
                fileDisplay = `<a href="http://localhost:5055/uploads/${contact.fileName}" target="_blank" style="color:var(--primary); text-decoration:underline;">${originalName}</a>`;
            }

            // New Beautiful Card Layout
            container.innerHTML += `
                <div class="service-category reveal active" id="card-${index}">
                    <h2 style="color: var(--dark); margin-bottom: 20px; font-size: 1.8rem;">${contact.name}</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 0.95rem; margin-bottom: 20px;">
                        <div><strong>Company:</strong> <span style="color:#555;">${companyText}</span></div>
                        <div><strong>Email:</strong> <span style="color:#555;">${contact.email}</span></div>
                        <div><strong>Phone:</strong> <span style="color:#555;">${phoneText}</span></div>
                        <div><strong>Country:</strong> <span style="color:#555;">${contact.country}</span></div>
                    </div>
                    
                    <div style="font-size: 0.95rem; margin-bottom: 20px;">
                        <strong>Message:</strong>
                        <p style="color:#555; background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 8px; border: 1px solid #eaeaea;">${contact.message}</p>
                    </div>

                    <div style="font-size: 0.95rem; margin-bottom: 25px;">
                        <strong>Attached File:</strong> ${fileDisplay}
                    </div>
                    
                    <div class="card-actions" style="display: flex; gap: 15px; border-top: 1px solid #eaeaea; padding-top: 20px;">
                        <button onclick="downloadPDF(${index})" class="btn-primary" style="padding: 10px 20px; border-radius: 6px; cursor: pointer; border: none; font-size: 0.95rem;"><i class="fas fa-file-pdf"></i> Download Receipt</button>
                        <button onclick="deleteUserSubmission(${index})" style="background: transparent; color: #ff4d4d; border: 1px solid #ff4d4d; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 0.95rem;"><i class="fas fa-trash-alt"></i> Remove</button>
                    </div>
                </div>
            `;
        });
    }
}

window.deleteUserSubmission = function(index) {
    if (confirm("Remove this record from your browser view? (This does not cancel your inquiry)")) {
        let localData = JSON.parse(localStorage.getItem("pitchtech_user_forms")) || [];
        localData.splice(index, 1);
        localStorage.setItem("pitchtech_user_forms", JSON.stringify(localData));
        renderUserSubmissions();
    }
};

// =========================================
// 4. ADMIN DASHBOARD (MySQL Data)
// =========================================
// Toggle Admin Password Visibility
window.togglePassword = function() {
    const pwdInput = document.getElementById("admin-pass");
    const icon = document.getElementById("toggle-pwd");
    if (pwdInput.type === "password") {
        pwdInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
        icon.style.color = "var(--primary)";
    } else {
        pwdInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
        icon.style.color = "#888";
    }
};

let currentAdminToken = "";

window.attemptAdminLogin = function() {
    const user = document.getElementById("admin-user").value;
    const pass = document.getElementById("admin-pass").value;
    const errorMsg = document.getElementById("admin-error");
    
    if (!user || !pass) { errorMsg.innerText = "Please enter both fields."; return; }
    
    currentAdminToken = "Basic " + btoa(user + ":" + pass);
    fetchAdminData(true);
};

window.fetchAdminData = function(isLoginAttempt = false) {
    const errorMsg = document.getElementById("admin-error");
    
    fetch("http://localhost:5055/api/contacts", { headers: { "Authorization": currentAdminToken } })
    .then(response => {
        if (!response.ok) throw new Error("Invalid");
        return response.json();
    })
    .then(data => {
        document.getElementById("admin-login-panel").style.display = "none";
        document.getElementById("admin-dashboard").style.display = "block";
        
        const tbody = document.getElementById("admin-table-body");
        tbody.innerHTML = "";
        
        if (data.length === 0) {
            tbody.innerHTML = "<tr><td colspan='10' style='text-align:center;'>No records in database.</td></tr>";
            return;
        }

        data.forEach((row, index) => {
            // 1. Continuous Display ID
            const displayId = index + 1; 
            
            // 2. "Not submitted" Fallbacks
            const dateStr = row.timestamp ? row.timestamp.split('T')[0] : 'Not submitted';
            const phoneStr = row.phone ? row.phone : '<span style="color:#aaa;">Not submitted</span>';
            const compStr = row.company ? row.company : '<span style="color:#aaa;">Not submitted</span>';
            const snippet = row.message.length > 30 ? row.message.substring(0, 30) + "..." : row.message;

            // 3. Clickable File Link (strips out the timestamp from the display name)
            let fileDisplay = '<span style="color:#aaa;">Not submitted</span>';
            if (row.fileName && row.fileName !== 'No file attached') {
                const originalName = row.fileName.substring(row.fileName.indexOf('_') + 1);
                fileDisplay = `<a href="http://localhost:5055/uploads/${row.fileName}" target="_blank" style="color:var(--primary); text-decoration:underline;">${originalName}</a>`;
            }

            tbody.innerHTML += `
                <tr>
                    <td><strong>${displayId}</strong></td>
                    <td>${dateStr}</td>
                    <td>${row.name}</td>
                    <td><a href="mailto:${row.email}">${row.email}</a></td>
                    <td>${phoneStr}</td>
                    <td>${compStr}</td>
                    <td>${row.country}</td>
                    <td title="${row.message}">${snippet}</td>
                    <td>${fileDisplay}</td>
                    <td>
                        <button onclick="deleteAdminSubmission(${row.id})" style="background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    })
    .catch(error => {
        if (isLoginAttempt) {
            errorMsg.innerText = "Access Denied: Invalid Credentials";
            currentAdminToken = "";
        }
    });
};

window.deleteAdminSubmission = function(id) {
    if (confirm("Permanently delete this record from the MySQL database?")) {
        fetch(`http://localhost:5055/api/contacts/${id}`, { method: "DELETE", headers: { "Authorization": currentAdminToken } })
        .then(() => fetchAdminData());
    }
};

// =========================================
// 5. PDF GENERATION
// =========================================
window.downloadPDF = async function(index) {
    const contact = window.submissionsData[index];
    if (!contact) return;

    const cardElement = document.getElementById(`card-${index}`);
    const pdfBtn = cardElement.querySelector('button');
    const originalBtnText = pdfBtn.innerHTML;
    pdfBtn.innerHTML = "Generating..."; pdfBtn.disabled = true;

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
        container.innerHTML = templateHtml;

        const opt = {
            margin:       [0, 0, 0.5, 0], 
            filename:     `PitchTech_Submission_${contact.name.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 2, useCORS: true }, 
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(container).save();

    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate PDF. Make sure you are running via a local server (not just clicking the HTML file).");
    } finally {
        pdfBtn.innerHTML = originalBtnText; pdfBtn.disabled = false;
    }
}; // <--- THIS WAS THE MISSING BRACKET FOR FUNCTION 5!

// =========================================
// 6. ADMIN DASHBOARD PDF GENERATOR
// =========================================
window.downloadAdminTablePDF = async function() {
    const originalTable = document.querySelector('.admin-table-wrapper');
    if (!originalTable) {
        alert("Table not found!");
        return;
    }

    // Change button text to Loading state
    const pdfBtn = document.getElementById('admin-pdf-btn');
    const originalText = pdfBtn.innerHTML;
    pdfBtn.innerHTML = "<i class='fas fa-spinner fa-spin'></i> Generating...";
    pdfBtn.disabled = true;

    try {
        // 1. Clone the table so we can modify it without ruining the webpage
        const cloneWrapper = originalTable.cloneNode(true);
        
        // FIX: Remove overflow so html2pdf doesn't crash or clip the image!
        cloneWrapper.style.overflow = "visible"; 
        cloneWrapper.style.width = "100%";
        
        // 2. Remove the "Actions" column (the last column) from every row
        const rows = cloneWrapper.querySelectorAll('tr');
        rows.forEach(row => {
            if(row.lastElementChild) {
                row.removeChild(row.lastElementChild);
            }
        });

        // 3. Create a clean container with a White Background and Title
        const pdfContent = document.createElement('div');
        pdfContent.style.padding = "20px";
        pdfContent.style.background = "#ffffff"; 
        pdfContent.innerHTML = `
            <h2 style="color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #ff7b29; padding-bottom: 10px; font-family: 'Roboto Slab', serif;">
                PitchTech Database Records
            </h2>
            <p style="color: #777; font-size: 12px; margin-top: -10px; margin-bottom: 20px; font-family: 'Roboto Slab', serif;">
                Generated on: ${new Date().toLocaleString()}
            </p>
        `;
        pdfContent.appendChild(cloneWrapper);

        // 4. Configure html2pdf for LANDSCAPE A4
        const opt = {
            margin:       0.3,
            filename:     `PitchTech_Admin_Report_${new Date().toISOString().split('T')[0]}.pdf`,
            image:        { type: 'jpeg', quality: 1 },
            // windowWidth forces the layout to act like a desktop screen so tables don't squish
            html2canvas:  { scale: 2, useCORS: true, windowWidth: 1200 }, 
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' } 
        };

        // 5. Generate and Save
        await html2pdf().set(opt).from(pdfContent).save();

    } catch (error) {
        console.error("PDF Generation Error:", error);
        alert("Failed to generate table PDF. Please try again.");
    } finally {
        // Reset the button back to normal
        pdfBtn.innerHTML = originalText;
        pdfBtn.disabled = false;
    }
};