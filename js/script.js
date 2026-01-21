// ===================================
// Smooth Scroll & Navigation
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Mobile Dropdown Toggle
    const navDropdowns = document.querySelectorAll('.nav-dropdown');

    navDropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('.nav-link');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        if (dropdownLink && dropdownMenu) {
            // For mobile: toggle dropdown on click
            dropdownLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Close other dropdowns
                    navDropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                            if (otherMenu) otherMenu.style.display = 'none';
                            const otherIcon = otherDropdown.querySelector('.nav-link i');
                            if (otherIcon) otherIcon.style.transform = 'rotate(0)';
                        }
                    });

                    // Toggle current dropdown
                    if (dropdownMenu.style.display === 'block') {
                        dropdownMenu.style.display = 'none';
                        const icon = dropdownLink.querySelector('i');
                        if (icon) icon.style.transform = 'rotate(0)';
                    } else {
                        dropdownMenu.style.display = 'block';
                        const icon = dropdownLink.querySelector('i');
                        if (icon) icon.style.transform = 'rotate(180deg)';
                    }
                }
            });

            // Close menu when clicking dropdown items
            const dropdownItems = dropdownMenu.querySelectorAll('a');
            dropdownItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        if (hamburger) hamburger.classList.remove('active');
                        if (navMenu) navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            });
        }
    });

    // Close menu when clicking regular nav links
    navLinks.forEach(link => {
        if (!link.closest('.nav-dropdown') || link.closest('.dropdown-menu')) {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && !link.parentElement.classList.contains('nav-dropdown')) {
                    if (hamburger) hamburger.classList.remove('active');
                    if (navMenu) navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown') && window.innerWidth <= 768) {
            navDropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) menu.style.display = 'none';
                const icon = dropdown.querySelector('.nav-link i');
                if (icon) icon.style.transform = 'rotate(0)';
            });
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1 && !this.closest('.dropdown-menu')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');

    const setActiveLink = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
                    link.classList.remove('active');
                });

                if (navLink) navLink.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', setActiveLink);


    document.querySelectorAll('.nav-list > li > .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) {
                document.querySelectorAll('.nav-list > li > .nav-link').forEach(l => {
                    l.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
});

// ===================================
// Header Scroll Effect
// ===================================
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// ===================================
// Hero Carousel
// ===================================
let currentSlideIndex = 0;
let slides, dots;
let autoSlideInterval;

function showSlide(index) {
    if (!slides || slides.length === 0) return;

    // Wrap around
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }

    // Hide all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Show current slide and dot
    if (slides[currentSlideIndex]) slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) dots[currentSlideIndex].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
    resetAutoSlide();
}

function currentSlide(index) {
    showSlide(index);
    resetAutoSlide();
}

function autoSlide() {
    changeSlide(1);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(autoSlide, 5000);
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    // Query slides and dots after DOM is ready
    slides = document.querySelectorAll('.carousel-slide');
    dots = document.querySelectorAll('.carousel-dot');

    if (slides.length > 0) {

        showSlide(0);

        // Start auto-sliding
        autoSlideInterval = setInterval(autoSlide, 5000);

        // // Pause on hover
        // const carouselContainer = document.querySelector('.carousel-container');
        // if (carouselContainer) {
        //     carouselContainer.addEventListener('mouseenter', () => {
        //         clearInterval(autoSlideInterval);
        //     });
        //
        //     carouselContainer.addEventListener('mouseleave', () => {
        //         resetAutoSlide();
        //     });
        // }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
            }
        });
    }
});

// ===================================
// Mobile Touch Swipe for Carousel
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    let touchStartX = 0;
    let touchEndX = 0;

    const carouselContainer = document.querySelector('.carousel-container');

    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for swipe

            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left - next slide
                changeSlide(1);
            }

            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - previous slide
                changeSlide(-1);
            }
        }
    }
});

// ===================================
// Counter Animation
// ===================================
const counters = document.querySelectorAll('.stat-number');
const speed = 200;
let animated = false;

const animateCounters = () => {
    if (animated) return;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;
        let count = 0;

        const updateCount = () => {
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target + '+';
            }
        };

        updateCount();
    });

    animated = true;
};

// Intersection Observer for counter animation
const counterSection = document.querySelector('.hero-stats');
if (counterSection) {
    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, observerOptions);

    counterObserver.observe(counterSection);
}

// ===================================
// Scroll Animations (Fade In)
// ===================================
const observeElements = () => {
    const elements = document.querySelectorAll('.product-card-compact, .contact-content');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
};

observeElements();

// ===================================
// Back to Top Button
// ===================================
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Contact Form - WhatsApp Integration
// ===================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values (Email removed)
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const serviceInput = document.getElementById('service');
        const messageInput = document.getElementById('message');

        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const service = serviceInput ? serviceInput.value : '';
        const message = messageInput ? messageInput.value.trim() : '';

        // Validate form
        if (!name || !phone || !service || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Create WhatsApp message
        const whatsappMessage = `
*New Inquiry from Website*

*Name:* ${name}
*Phone:* ${phone}
*Service Interested:* ${service}

*Message:*
${message}
        `.trim();

        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // WhatsApp number
        const whatsappNumber = '918106677205';

        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Open WhatsApp in new tab
        window.open(whatsappURL, '_blank');

        // Reset form
        contactForm.reset();

        // Show success message
        showNotification('Your message will be sent via WhatsApp. Thank you!');
    });
}

// ===================================
// Notification Function
// ===================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #90353D 0%, #6b2830 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(144, 53, 61, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Lazy Loading Images
// ===================================
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

lazyLoadImages();

// ===================================
// Form Input Animations
// ===================================
const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
        input.style.borderColor = '#90353D';
    });

    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
        if (!input.value) {
            input.style.borderColor = '#e5e7eb';
        }
    });
});

// ===================================
// Phone Number Formatting
// ===================================
const phoneInput = document.getElementById('phone');

if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        e.target.value = value;
    });
}

// ===================================
// Email Validation
// ===================================
const emailInput = document.getElementById('email');

if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = '#ef4444';
            showNotification('Please enter a valid email address');
        } else {
            emailInput.style.borderColor = '#90353D';
        }
    });
}

// ===================================
// Floating Call Button Tracking
// ===================================
const floatingCallBtns = document.querySelectorAll('.floating-call-btn');

floatingCallBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        console.log('Call button clicked');
    });
});

// ===================================
// Scroll Progress Indicator
// ===================================
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, #90353D 0%, #b04450 50%, #90353D 100%);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createScrollProgress();

// ===================================
// Prevent right-click on images
// ===================================
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// ===================================
// Print Optimization
// ===================================
window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.whatsapp-float, .back-to-top, .floating-call-btn').forEach(el => {
        el.style.display = 'none';
    });
});

window.addEventListener('afterprint', () => {
    document.querySelectorAll('.whatsapp-float, .back-to-top, .floating-call-btn').forEach(el => {
        el.style.display = '';
    });
});

// ===================================
// Accessibility Enhancements
// ===================================
// Skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #90353D;
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
`;
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// Keyboard navigation for cards
document.querySelectorAll('.service-card, .product-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const link = card.querySelector('a');
            if (link) link.click();
        }
    });
});

// ===================================
// Dynamic Copyright Year
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
    }
});

// ===================================
// Initialize all functions
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ All scripts loaded successfully');
    console.log('📱 Contact: +91 7995717177');
    console.log('📧 Email: vijayasrinivasa.business@gmail.com');
    console.log('🏢 Vijaya Srinivasa Enterprises');
});
