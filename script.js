/* =========================================
   PITCHTECH MAIN JAVASCRIPT
   ========================================= */

// =========================================
// 1. RUN ON PAGE LOAD (Event Listeners)
// =========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // --- Mobile Menu Logic ---
    const servicesBtn = document.querySelector('.has-dropdown > a');
    const dropdownParent = document.querySelector('.has-dropdown');
    
    /// --- Dynamic Form Features ---
    const countrySelect = document.getElementById("country");
    const phoneInput = document.getElementById("phone");

    // Populate the country dropdown if it exists
    if (countrySelect) {
        populateCountries();

        // NEW: Dictionary mapping the values to their dial codes
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

        // NEW: Listen for when the user selects a country
        countrySelect.addEventListener("change", function() {
            const selectedCountry = this.value; // e.g., 'india'
            
            // If the country exists in our dictionary, update the phone input
            if (dialCodes[selectedCountry]) {
                // Adds the code and a space so they can start typing their 10 digits
                phoneInput.value = dialCodes[selectedCountry] + " "; 
                // Removes the red error border if it was there
                phoneInput.classList.remove("input-error"); 
                document.getElementById("phone-error").innerText = "";
            }
        });
    }

    // Close the entire mobile menu when any normal link is clicked
    document.querySelectorAll('nav ul li a:not(.has-dropdown > a)').forEach(link => {
        link.addEventListener('click', () => {
            const menuToggle = document.getElementById('menu-toggle');
            if (menuToggle) menuToggle.checked = false;
        });
    });

    // --- Dynamic Form Features ---
    // Populate the country dropdown if it exists on the page
    if (document.getElementById("country")) {
        populateCountries();
    }

    // Handle file attachment text update
    const fileInput = document.getElementById('attachment');
    const fileChosenText = document.getElementById('file-chosen');

    if (fileInput && fileChosenText) {
        fileInput.addEventListener('change', function() {
            // When a file is picked, update the "No File Chosen" span with the file name
            if(this.files && this.files.length > 0) {
                fileChosenText.textContent = this.files[0].name;
                fileChosenText.style.color = '#555'; 
            } else {
                // Revert back if they un-select
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

    // Alphabetically sort the main list
    countries.sort();

    // Add "Other" to the very end of the array after sorting
    countries.push("Other");

    // Loop through the array and create an option element for each
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
    let firstErrorInput = null; // NEW: Track the first field with an error

    // Grab all input elements
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const countryInput = document.getElementById("country");
    const messageInput = document.getElementById("message");

    // Grab their values and trim whitespace
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const country = countryInput.value;
    const message = messageInput.value.trim();

    // Helper Function to display an error
    function showError(inputElement, errorId, errorMessage) {
        document.getElementById(errorId).innerText = errorMessage;
        inputElement.classList.add("input-error");
        isValid = false; 
        
        // NEW: If this is the first error we've found, save it!
        if (!firstErrorInput) {
            firstErrorInput = inputElement;
        }
    }

    // Helper Function to clear all previous errors
    function clearErrors() {
        const errorTexts = document.querySelectorAll(".error-message");
        errorTexts.forEach(span => span.innerText = ""); 
        
        const errorInputs = document.querySelectorAll(".input-error");
        errorInputs.forEach(input => input.classList.remove("input-error")); 
    }

    // Clear old errors every time the submit button is pressed
    clearErrors();

    // --- Run individual validations ---
    
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

    // --- Final Check & Auto-Scroll ---
    if (!isValid) {
        // Form is invalid: Scroll directly to the first error smoothly
        firstErrorInput.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorInput.focus(); // Puts the blinking cursor inside the box
    } else {
        // Form is valid: Success!
        alert("Form submitted successfully! PitchTech will be in touch."); 
    }

    return isValid; 
}