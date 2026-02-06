// TaskMeridian - CRO Optimized JavaScript with Analytics
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initFAQ();
    initWorkflows();
    initCalculator();
    initSmoothScroll();
    initLeadMagnetForm();
    initAnalytics();
    initScrollTracking();
    
    // Optional: Urgency banner
    // showUrgencyBanner();
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
// Workflow Expand/Collapse
// ========================================
function initWorkflows() {
    const workflowCards = document.querySelectorAll('.workflow-card');
    
    workflowCards.forEach(card => {
        const expandBtn = card.querySelector('.workflow-expand');
        
        expandBtn.addEventListener('click', () => {
            const workflowType = card.dataset.workflow;
            const isExpanding = !card.classList.contains('expanded');
            
            // Track workflow expand
            trackEvent(isExpanding ? 'workflow_expand' : 'workflow_collapse', { 
                workflow: workflowType 
            });
            
            // Toggle current card
            card.classList.toggle('expanded');
            
            // Update button text
            const btnText = expandBtn.querySelector('span');
            btnText.textContent = isExpanding ? 'Hide details' : 'See how it works';
        });
    });
}

// ========================================
// Time Savings Calculator
// ========================================
function initCalculator() {
    const emailSlider = document.getElementById('email-hours');
    const schedulingSlider = document.getElementById('scheduling-hours');
    const researchSlider = document.getElementById('research-hours');
    const hourlyRateInput = document.getElementById('hourly-rate');
    
    if (!emailSlider || !schedulingSlider || !researchSlider || !hourlyRateInput) return;
    
    const emailValue = document.getElementById('email-value');
    const schedulingValue = document.getElementById('scheduling-value');
    const researchValue = document.getElementById('research-value');
    
    const weeklyLossEl = document.getElementById('weekly-loss');
    const annualCostEl = document.getElementById('annual-cost');
    const weeklySavedEl = document.getElementById('weekly-saved');
    const annualSavedEl = document.getElementById('annual-saved');
    
    let hasTrackedCalculatorUse = false;
    
    function formatCurrency(amount) {
        if (amount >= 100000) {
            return '₹' + (amount / 100000).toFixed(2) + 'L';
        } else if (amount >= 1000) {
            return '₹' + (amount / 1000).toFixed(1) + 'K';
        }
        return '₹' + amount;
    }
    
    function calculate() {
        const emailHours = parseFloat(emailSlider.value) || 0;
        const schedulingHours = parseFloat(schedulingSlider.value) || 0;
        const researchHours = parseFloat(researchSlider.value) || 0;
        const hourlyRate = parseFloat(hourlyRateInput.value) || 2000;
        
        // Track first calculator interaction
        if (!hasTrackedCalculatorUse) {
            trackEvent('calculator_interaction', {
                email_hours: emailHours,
                scheduling_hours: schedulingHours,
                research_hours: researchHours,
                hourly_rate: hourlyRate
            });
            hasTrackedCalculatorUse = true;
        }
        
        // Update slider labels
        emailValue.textContent = emailHours + (emailHours === 1 ? ' hour' : ' hours');
        schedulingValue.textContent = schedulingHours + (schedulingHours === 1 ? ' hour' : ' hours');
        researchValue.textContent = researchHours + (researchHours === 1 ? ' hour' : ' hours');
        
        // Calculate weekly hours
        const weeklyEmailHours = emailHours * 5;
        const totalWeeklyHours = weeklyEmailHours + schedulingHours + researchHours;
        
        // Calculate savings (80% automation efficiency)
        const weeklySaved = totalWeeklyHours * 0.8;
        
        // Calculate costs
        const weeklyCost = totalWeeklyHours * hourlyRate;
        const annualCost = weeklyCost * 52;
        const weeklySavedCost = weeklySaved * hourlyRate;
        const annualSaved = weeklySavedCost * 52;
        
        // Update display
        weeklyLossEl.textContent = totalWeeklyHours.toFixed(1) + ' hours/week';
        annualCostEl.textContent = formatCurrency(annualCost) + '/year';
        weeklySavedEl.textContent = weeklySaved.toFixed(1) + ' hours/week';
        annualSavedEl.textContent = formatCurrency(annualSaved) + '/year';
    }
    
    // Add event listeners
    emailSlider.addEventListener('input', calculate);
    schedulingSlider.addEventListener('input', calculate);
    researchSlider.addEventListener('input', calculate);
    hourlyRateInput.addEventListener('input', calculate);
    
    // Initial calculation
    calculate();
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
// Urgency Banner (Optional)
// ========================================
function showUrgencyBanner() {
    const banner = document.querySelector('.trust-banner-top p');
    if (!banner) return;
    
    const spots = 47;
    const updateBanner = () => {
        const remaining = Math.max(1, spots - Math.floor(Math.random() * 3));
        banner.innerHTML = `🚀 <strong>${remaining} spots remaining</strong> this month. Book your free call before they're gone.`;
    };
    
    setInterval(updateBanner, 30000);
}
