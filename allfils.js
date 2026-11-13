document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedDir = localStorage.getItem('dir') || 'ltr';

    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('dir', savedDir);

    updateThemeIcon(savedTheme);

    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    const rtlToggleBtn = document.getElementById('rtlToggle');
    if (rtlToggleBtn) {
        rtlToggleBtn.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
        });
    }

    /* --- Dynamic Active Navbar Link Highlighter --- */
    const currentPage = window.location.pathname.split("/").pop() || "main.html";
    const navItems = document.querySelectorAll(".nav-links a");

    navItems.forEach(link => {
        link.classList.remove("active");
        const linkHref = link.getAttribute("href");
        
        if (linkHref === currentPage || (currentPage === "" && linkHref === "main.html")) {
            link.classList.add("active");
            
            const parentDropdown = link.closest(".dropdown");
            if (parentDropdown) {
                const dropdownToggle = parentDropdown.querySelector("a");
                if (dropdownToggle) dropdownToggle.classList.add("active");
            }
        }
    });

    /* --- Mobile Navigation Menu Toggle --- */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.className = navLinks.classList.contains('mobile-active') 
                    ? 'fa-solid fa-xmark' 
                    : 'fa-solid fa-bars';
            }
        });
    }

    /* --- Mobile Dropdown Toggle Support --- */
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            }
        });
    }

    const filterButtons = document.querySelectorAll('.pill-btn');
    const productCards = document.querySelectorAll('.product-card, .grid .card');

    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                productCards.forEach(card => {
                    const tagElement = card.querySelector('.card-tags');
                    const cardTag = tagElement ? tagElement.textContent.trim() : '';

                    if (filterValue === 'all' || cardTag === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    const productSearchInput = document.getElementById('productSearch');
    if (productSearchInput) {
        productSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            productCards.forEach(card => {
                const titleElement = card.querySelector('.card-title');
                const titleText = titleElement ? titleElement.textContent.toLowerCase() : '';

                if (titleText.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    const enquiryForm = document.getElementById('enquiryForm');
    const formSuccess = document.getElementById('formSuccess');

    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            enquiryForm.style.display = 'none';
            if (formSuccess) {
                formSuccess.style.display = 'block';
            }
        });
    }
});

function updateThemeIcon(theme) {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }
}

/* --- Scroll-Down Animation Observer --- */
document.addEventListener("DOMContentLoaded", function () {
    const targets = document.querySelectorAll("section, .card, .stat-card");

    targets.forEach(el => {
        el.classList.add("reveal-on-scroll");
    });

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.10 // Triggers when 10% of the element enters the viewport
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observerInstance.unobserve(entry.target); // Animate smoothly once when scrolled into view
            }
        });
    }, observerOptions);

    targets.forEach(el => observer.observe(el));
});

/* --- Interactive Testimonial Carousel Controller --- */
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".testimonial-carousel-wrapper").forEach(wrapper => {
        const slides = wrapper.querySelectorAll(".testimonial-slide");
        const dots = wrapper.querySelectorAll(".dot");
        const prevBtn = wrapper.querySelector(".prev-btn");
        const nextBtn = wrapper.querySelector(".next-btn");
        let currentIndex = 0;
        let timer = null;

        function showSlide(index) {
            slides.forEach((s, i) => s.classList.toggle("active", i === index));
            dots.forEach((d, i) => d.classList.toggle("active", i === index));
            currentIndex = index;
        }

        function nextSlide() {
            showSlide((currentIndex + 1) % slides.length);
        }

        function prevSlide() {
            showSlide((currentIndex - 1 + slides.length) % slides.length);
        }

        function startTimer() {
            stopTimer();
            timer = setInterval(nextSlide, 4000); // 4 seconds interval
        }

        function stopTimer() {
            if (timer) clearInterval(timer);
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener("click", () => { nextSlide(); startTimer(); });
            prevBtn.addEventListener("click", () => { prevSlide(); startTimer(); });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener("click", () => { showSlide(idx); startTimer(); });
        });

        wrapper.addEventListener("mouseenter", stopTimer);
        wrapper.addEventListener("mouseleave", startTimer);

        if (slides.length > 0) {
            showSlide(0);
            startTimer();
        }
    });
});

//aboutus//
document.addEventListener("DOMContentLoaded", function () {
    const milestonesBanner = document.querySelector(".milestones-banner");
    const statNumbers = document.querySelectorAll(".milestones-banner .stat-number");
    let animated = false;

    const runCounter = () => {
      statNumbers.forEach(counter => {
        const target = parseFloat(counter.getAttribute("data-target"));
        const suffix = counter.getAttribute("data-suffix") || "";
        const decimal = parseInt(counter.getAttribute("data-decimal")) || 0;
        const useComma = counter.getAttribute("data-comma") === "true";
        
        let duration = 2000; 
        let startTime = null;

        const updateCount = (currentTime) => {
          if (!startTime) startTime = currentTime;
          let progress = currentTime - startTime;
          let percentage = Math.min(progress / duration, 1);
          
          let easeProgress = 1 - Math.pow(1 - percentage, 3);
          let currentVal = easeProgress * target;

          let formattedVal = decimal > 0 ? currentVal.toFixed(decimal) : Math.floor(currentVal);
          if (useComma) {
            formattedVal = Number(formattedVal).toLocaleString();
          }

          counter.textContent = formattedVal + suffix;

          if (percentage < 1) {
            requestAnimationFrame(updateCount);
          }
        };

        requestAnimationFrame(updateCount);
      });
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          milestonesBanner.classList.add("visible");
          runCounter();
          animated = true;
          observerInstance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    if (milestonesBanner) {
      observer.observe(milestonesBanner);
    }
  });
  /* --- Dynamic Active Navbar Link Highlighter --- */
document.addEventListener("DOMContentLoaded", () => {
    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "" || currentPage === "/") {
        currentPage = "index.html";
    }

    // Target strictly top-level navbar links to avoid dropdown conflicts
    const navItems = document.querySelectorAll(".nav-links > li > a");

    navItems.forEach(link => {
        link.classList.remove("active");
        const linkHref = link.getAttribute("href");
        
        if (linkHref === currentPage) {
            link.classList.add("active");
            
            const parentDropdown = link.closest(".dropdown");
            if (parentDropdown) {
                const dropdownToggle = parentDropdown.querySelector(".dropdown-toggle");
                if (dropdownToggle) dropdownToggle.classList.add("active");
            }
        }
    });
});