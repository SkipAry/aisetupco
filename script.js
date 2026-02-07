// TaskMeridian - CRO Optimized JavaScript with Analytics
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavbar();
    initFAQ();

    initCalculator();
    initSmoothScroll();
    initLeadMagnetForm();
    initAnalytics();
    initScrollTracking();

});

// ========================================
// FAQ Accordion
// ========================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Track FAQ open event
            const questionText = question.querySelector('span').textContent;
            trackEvent('faq_open', { question: questionText });
            
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
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Track scroll to section
                trackEvent('scroll_to_section', { section: href });
            }
        });
    });
}

// ========================================
// Lead Magnet Form
// ========================================
function initLeadMagnetForm() {
    const form = document.querySelector('.lead-magnet-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Track lead magnet submission
        trackEvent('lead_magnet_submit', {
            source: 'starter_kit'
        });
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                form.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
                        <h3 style="margin-bottom: 12px; color: var(--color-success);">Check Your Email!</h3>
                        <p style="color: var(--color-text-secondary);">Your AI Automation Starter Kit is on its way.</p>
                    </div>
                `;
                
                trackEvent('lead_magnet_success');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            trackEvent('lead_magnet_error', { error: error.message });
            
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'padding: 12px; margin-top: 16px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); color: #ef4444; font-size: 0.9rem;';
            errorDiv.innerHTML = '❌ Something went wrong. Please try again.';
            
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
// Booking Form Handler
// ========================================
function initBookingForm() {
    const form = document.querySelector('.booking-form');
    if (!form) return;
    
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
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        trackEvent('booking_form_submit');
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                trackEvent('booking_form_success');
                
                form.innerHTML = `
                    <div class="form-success" style="padding: 24px; border-radius: 12px; background: rgba(5, 150, 105, 0.1); color: #059669;">
                        <div style="font-size: 48px; margin-bottom: 16px;">✓</div>
                        <h3 style="margin-bottom: 8px; color: #059669;">Thank You!</h3>
                        <p>We've received your request and will contact you within <strong>24 hours</strong>.</p>
                        <p style="margin-top: 12px; font-size: 0.9rem; opacity: 0.8;">Check your email for confirmation.</p>
                    </div>
                `;
                
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            trackEvent('booking_form_error', { error: error.message });
            
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = originalText;
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = 'padding: 12px; margin-top: 16px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); color: #ef4444; font-size: 0.9rem;';
            errorDiv.innerHTML = '❌ Something went wrong. Please try again or email us at <a href="mailto:hello@taskmeridian.com" style="color: #ef4444; text-decoration: underline;">hello@taskmeridian.com</a>';
            
            const existingError = form.querySelector('.form-error');
            if (existingError) existingError.remove();
            form.appendChild(errorDiv);
        }
    });
}

// Initialize booking form
document.addEventListener('DOMContentLoaded', initBookingForm);

// ========================================
// Legal Tabs Functionality
// ========================================
function initLegalTabs() {
    const tabs = document.querySelectorAll('.legal-tab');
    const contents = document.querySelectorAll('.legal-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(targetId).classList.add('active');
            
            trackEvent('legal_tab_click', { tab: targetId });
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
