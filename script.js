// AI Setup Co. - CRO Optimized JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close others
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });
            
            // Toggle current
            item.classList.toggle('active');
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add urgency timer (optional - can be enabled)
    // showUrgencyBanner();
});

// Optional: Urgency banner functionality
function showUrgencyBanner() {
    const banner = document.querySelector('.trust-banner-top p');
    if (!banner) return;
    
    const spots = 12;
    const updateBanner = () => {
        const remaining = Math.max(1, spots - Math.floor(Math.random() * 3));
        banner.innerHTML = `🚀 <strong>${remaining} spots remaining</strong> this month. Book your free call before they're gone.`;
    };
    
    // Update every 30 seconds
    setInterval(updateBanner, 30000);
}

// Booking Form Handler
function initBookingForm() {
    const form = document.querySelector('.booking-form');
    if (!form) return;
    
    // Real-time validation feedback
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.checkValidity()) {
                input.style.borderColor = '#059669';
            } else if (input.value) {
                input.style.borderColor = '#ef4444';
            }
        });
        
        input.addEventListener('focus', () => {
            input.style.borderColor = '';
        });
    });
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all fields
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state with spinner
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success - show thank you message
                form.innerHTML = `
                    <div class="form-success" style="padding: 24px; border-radius: 12px; background: rgba(5, 150, 105, 0.1); color: #059669;">
                        <div style="font-size: 48px; margin-bottom: 16px;">✓</div>
                        <h3 style="margin-bottom: 8px; color: #059669;">Thank You!</h3>
                        <p>We've received your request and will contact you within <strong>24 hours</strong>.</p>
                        <p style="margin-top: 12px; font-size: 0.9rem; opacity: 0.8;">Check your email for confirmation.</p>
                    </div>
                `;
                
                // Scroll to success message
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Error - restore button
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = originalText;
            
            // Show error message in form
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = 'padding: 12px; margin-top: 16px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); color: #ef4444; font-size: 0.9rem;';
            errorDiv.innerHTML = '❌ Something went wrong. Please try again or email us at <a href="mailto:hello@aisetup.co" style="color: #ef4444; text-decoration: underline;">hello@aisetup.co</a>';
            
            const existingError = form.querySelector('.form-error');
            if (existingError) existingError.remove();
            form.appendChild(errorDiv);
        }
    });
}

// Initialize booking form
document.addEventListener('DOMContentLoaded', initBookingForm);

// Legal Tabs Functionality
function initLegalTabs() {
    const tabs = document.querySelectorAll('.legal-tab');
    const contents = document.querySelectorAll('.legal-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            
            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            tab.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Global function for footer links
function showLegalTab(tabName) {
    const tab = document.querySelector(`.legal-tab[data-tab="${tabName}"]`);
    if (tab) {
        tab.click();
        document.getElementById('legal').scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize legal tabs
document.addEventListener('DOMContentLoaded', initLegalTabs);
