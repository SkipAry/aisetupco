// TaskMeridian - CRO Optimized JavaScript with Analytics
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavbar();
    initFAQ();
    initCalculator();
    initSmoothScroll();
    initBookingForm();
    initAnalytics();
    initScrollTracking();
    initScrollAnimations();
});

// ========================================
// FAQ Accordion (Native details/summary)
// ========================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                // Track FAQ open event
                const questionText = item.querySelector('.faq-question span').textContent;
                trackEvent('faq_open', { question: questionText });
            }
        });
    });
}

// ========================================
// ROI Calculator
// ========================================
function initCalculator() {
    const emailsSlider = document.getElementById('calc-emails');
    const schedulingSlider = document.getElementById('calc-scheduling');
    const researchSlider = document.getElementById('calc-research');
    const rateInput = document.getElementById('calc-rate');
    
    if (!emailsSlider || !schedulingSlider || !researchSlider || !rateInput) return;
    
    const emailsValue = document.getElementById('calc-emails-value');
    const schedulingValue = document.getElementById('calc-scheduling-value');
    const researchValue = document.getElementById('calc-research-value');
    
    const currentHoursEl = document.getElementById('calc-current-hours');
    const currentCostEl = document.getElementById('calc-current-cost');
    const savedHoursEl = document.getElementById('calc-saved-hours');
    const savedCostEl = document.getElementById('calc-saved-cost');
    
    let hasTrackedCalculatorUse = false;
    
    function formatCurrency(amount) {
        // Format in Lakhs for Indian context
        if (amount >= 100000) {
            return '₹' + (amount / 100000).toFixed(2) + 'L/year';
        }
        return '₹' + amount.toLocaleString('en-IN') + '/year';
    }
    
    function updateCalculator() {
        const emailsPerDay = parseInt(emailsSlider.value) || 0;
        const schedulingHours = parseInt(schedulingSlider.value) || 0;
        const researchHours = parseInt(researchSlider.value) || 0;
        const hourlyRate = parseInt(rateInput.value) || 2000;
        
        // Track first interaction
        if (!hasTrackedCalculatorUse) {
            trackEvent('calculator_interaction', {
                emails_per_day: emailsPerDay,
                scheduling_hours: schedulingHours,
                research_hours: researchHours,
                hourly_rate: hourlyRate
            });
            hasTrackedCalculatorUse = true;
        }
        
        // Update value displays
        emailsValue.textContent = emailsPerDay + '/day';
        schedulingValue.textContent = schedulingHours + ' hrs';
        researchValue.textContent = researchHours + ' hrs';
        
        // Calculate weekly hours (emails * 5 work days, assuming 5 min per email = 12 emails/hr)
        const emailHoursPerWeek = (emailsPerDay * 5) / 12;
        const totalWeeklyHours = emailHoursPerWeek + schedulingHours + researchHours;
        
        // Calculate savings (80% automation efficiency)
        const weeklyHoursSaved = totalWeeklyHours * 0.8;
        
        // Calculate annual costs (52 weeks)
        const annualHours = totalWeeklyHours * 52;
        const annualHoursSaved = weeklyHoursSaved * 52;
        const annualCost = annualHours * hourlyRate;
        const annualSavings = annualHoursSaved * hourlyRate;
        
        // Update display
        currentHoursEl.textContent = annualHours.toFixed(0);
        currentCostEl.textContent = formatCurrency(annualCost);
        savedHoursEl.textContent = annualHoursSaved.toFixed(0);
        savedCostEl.textContent = formatCurrency(annualSavings);
    }
    
    // Event listeners
    emailsSlider.addEventListener('input', updateCalculator);
    schedulingSlider.addEventListener('input', updateCalculator);
    researchSlider.addEventListener('input', updateCalculator);
    rateInput.addEventListener('input', updateCalculator);
    
    // Initial calculation
    updateCalculator();
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Track scroll to section
                trackEvent('scroll_to_section', { section: href });
            }
        });
    });
}

// ========================================
// Booking Form Handler
// ========================================
function initBookingForm() {
    const form = document.querySelector('.final-cta-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        trackEvent('booking_form_submit');
        
        const submitBtn = form.querySelector('.final-cta-submit');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                trackEvent('booking_form_success');
                
                form.innerHTML = `
                    <div class="form-success" style="padding: 32px; border-radius: 12px; background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.2);">
                        <div style="font-size: 48px; margin-bottom: 16px; color: #4ADE80;">✓</div>
                        <h3 style="margin-bottom: 12px; color: #F8FAFC; font-size: 20px;">Thank You!</h3>
                        <p style="color: #94A3B8; line-height: 1.6;">We've received your request and will contact you within <strong style="color: #F8FAFC;">24 hours</strong> to schedule your consultation.</p>
                    </div>
                `;
                
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            trackEvent('booking_form_error', { error: error.message });
            
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = 'padding: 12px; margin-top: 16px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); color: #ef4444; font-size: 14px;';
            errorDiv.innerHTML = 'Something went wrong. Please try again or email us at <a href="mailto:hello@taskmeridian.com" style="color: #ef4444; text-decoration: underline;">hello@taskmeridian.com</a>';
            
            const existingError = form.querySelector('.form-error');
            if (existingError) existingError.remove();
            form.appendChild(errorDiv);
        }
    });
}

// ========================================
// Analytics Tracking
// ========================================
function initAnalytics() {
    // Track all CTA clicks
    document.querySelectorAll('[data-cta]').forEach(cta => {
        cta.addEventListener('click', () => {
            const ctaName = cta.getAttribute('data-cta');
            trackEvent('cta_click', { cta: ctaName });
        });
    });
    
    // Track pricing card views (intersection observer)
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackEvent('pricing_viewed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(pricingSection);
    }
    
    // Track time on page
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage += 10;
        if (timeOnPage === 30 || timeOnPage === 60 || timeOnPage === 180) {
            trackEvent('time_on_page', { seconds: timeOnPage });
        }
    }, 10000);
}

// ========================================
// Scroll Depth Tracking
// ========================================
function initScrollTracking() {
    const scrollDepths = [25, 50, 75, 90];
    const trackedDepths = new Set();
    
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !trackedDepths.has(depth)) {
                trackedDepths.add(depth);
                trackEvent('scroll_depth', { depth: depth });
            }
        });
    });
}

// ========================================
// Track Event Helper
// ========================================
function trackEvent(eventName, params = {}) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, params);
    }
    
    // Console log for debugging
    console.log('[Analytics]', eventName, params);
}

// ========================================
// Navbar Scroll Behavior
// ========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        });
    }
    
    // Mobile hamburger toggle
    const hamburger = document.querySelector('.nav-hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// ========================================
// Scroll-triggered fade-up animations
// ========================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });
}
