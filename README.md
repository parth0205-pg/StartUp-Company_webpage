# PitchTech Full-Stack Website (Frontend)

A modern, fully responsive, and dynamic multi-page website for PitchTech, a tech consultancy and software development agency. Originally built as a static template, this project has evolved into a fully functional frontend application integrated with a Java Spring Boot and MySQL REST API.

**Live Static Demo:** [PitchTech on GitHub Pages](https://parth0205-pg.github.io/StartUp-Company_webpage/) 
*(Note: Form submissions and the Admin Dashboard require the local Spring Boot backend to be running).*

## Key Features

* **Multi-Page Architecture:** Includes Home, About, Contact, Privacy Policy, Terms of Service, and a secure Admin Submissions dashboard.
* **Dynamic Contact Form:** Features real-time client-side validation, auto-formatting country dial codes, and multipart file attachment handling.
* **Modern UI Feedback:** Replaces default browser alerts with sleek, animated Toast Notifications and dynamic button-loading states.
* **Admin Dashboard (Secured):** A protected `/submissions.html` route that fetches data from the Spring Boot database using HTTP Basic Authentication tokens.
* **Client-Side PDF Generation:** Uses `html2pdf.js` to asynchronously fetch a hidden HTML template (`pdf-template.html`), inject specific client data, and generate a highly professional, A4-formatted PDF record directly in the browser.
* **Fluid & Responsive Typography:** Uses CSS `clamp()` for fluid typography that scales perfectly across ultrawide monitors, laptops, tablets, and mobile devices.
* **Glass-morphism Navigation:** A sticky header with a semi-transparent, blurred background.

## Tech Stack

**Frontend:**
* **HTML5:** Semantic markup and multi-page routing.
* **CSS3:** Flexbox, Grid, CSS animations/transitions, and Fluid Typography.
* **Vanilla JavaScript (ES6+):** DOM manipulation, Fetch API, asynchronous data handling (`async/await`), and form logic.
* **Libraries:** `html2pdf.js` (for PDF document generation), FontAwesome v6.5.1 (Icons), Google Fonts (Roboto Slab).

**Backend Requirements:**
* **Java Spring Boot:** REST API listening on `http://localhost:5055`.
* **Database:** MySQL (Hibernate/JPA) handling the `contact_submissions` table.

## Project Structure

```text
pitchtech-landing-page/
│
├── images/
│   ├── logo.png             # PitchTech company logo
│   ├── home.png             # Hero section background image
│   ├── about-us.png         # About page background
│   └── company.png          # Contact page background
│
├── index.html               # Main Landing Page
├── about.html               # About Us Page
├── contact.html             # Dynamic Contact Form Page
├── submissions.html         # Secured Admin Dashboard
├── pdf-template.html        # Hidden template for PDF generation
├── privacy-policy.html      # Legal - Privacy
├── terms.html               # Legal - Terms of Service
│
├── style.css                # Global stylesheet (Fluid design)
├── script.js                # Core JS logic (Validation, Fetch API, PDF gen)
└── README.md                # Project documentation