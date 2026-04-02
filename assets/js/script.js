document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    const navLinks = siteNav.querySelectorAll("a");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 760) {
          siteNav.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    const successMessage = document.querySelector("[data-fs-success]");
    const errorMessage = document.querySelector("[data-fs-error]");
    const submitButton = contactForm.querySelector("[data-fs-submit-btn]");
    const errorFields = contactForm.querySelectorAll("[data-fs-error]");

    function clearFieldErrors() {
      errorFields.forEach(function (field) {
        if (field.hasAttribute("data-fs-error")) {
          field.textContent = "";
          field.style.display = "none";
        }
      });
    }

    function hideMessages() {
      if (successMessage) {
        successMessage.style.display = "none";
      }
      if (errorMessage) {
        errorMessage.style.display = "none";
      }
    }

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      hideMessages();
      clearFieldErrors();

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        const formData = new FormData(contactForm);

        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        const result = await response.json();

        if (response.ok) {
          contactForm.reset();

          if (successMessage) {
            successMessage.style.display = "block";
          }

          window.location.href = "thank-you.html";
          return;
        }

        if (result && Array.isArray(result.errors)) {
          result.errors.forEach(function (error) {
            if (error.path && error.path.length > 0) {
              const fieldName = error.path[0];
              const fieldError = contactForm.querySelector(
                '[data-fs-error="' + fieldName + '"]'
              );

              if (fieldError) {
                fieldError.textContent = error.message;
                fieldError.style.display = "block";
              }
            }
          });
        }

        if (errorMessage) {
          errorMessage.style.display = "block";
        }
      } catch (error) {
        if (errorMessage) {
          errorMessage.style.display = "block";
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Request My Quote";
        }
      }
    });
  }
});
