// Dynamic Content Script - TaskMeridian
// Handles returning visitors, UTM tracking, and personalization

(function() {
    'use strict';
    
    // ========================================
    // UTM Parameter Tracking
    // ========================================
    function getUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            source: params.get('utm_source'),
            medium: params.get('utm_medium'),
            campaign: params.get('utm_campaign'),
            content: params.get('utm_content')
        };
    }
    
    function storeUTMParams() {
        const utms = getUTMParams();
        if (utms.source) {
            localStorage.setItem('utm_source', utms.source);
            localStorage.setItem('utm_medium', utms.medium || '');
            localStorage.setItem('utm_campaign', utms.campaign || '');
            localStorage.setItem('first_visit_source', utms.source);
        }
    }
    
    // ========================================
    // Returning Visitor Detection
    // ========================================
    function isReturningVisitor() {
        return localStorage.getItem('visited_before') === 'true';
    }
    
    function markAsVisited() {
        localStorage.setItem('visited_before', 'true');
        localStorage.setItem('first_visit_date', new Date().toISOString());
    }
    
    function getVisitCount() {
        return parseInt(localStorage.getItem('visit_count') || '0');
    }
    
    function incrementVisitCount() {
        const count = getVisitCount() + 1;
        localStorage.setItem('visit_count', count.toString());
        return count;
    }
    
    // ========================================
    // Geo Location (Simple IP-based)
    // ========================================
    function detectLocation() {
        // Try to get from localStorage first
        const cachedLocation = localStorage.getItem('user_location');
        if (cachedLocation) {
            return JSON.parse(cachedLocation);
        }
        
        // Default to empty, will be populated by API call if needed
        return { city: null, region: null, country: 'IN' };
    }
    
    // ========================================
    // Personalization Logic
    // ========================================
    function personalizeContent() {
        const utms = getUTMParams();
        const storedSource = localStorage.getItem('utm_source');
        const source = utms.source || storedSource;
        const isReturning = isReturningVisitor();
        const visitCount = getVisitCount();
        
        // Personalize hero section for returning visitors
        if (isReturning && visitCount > 1) {
            personalizeForReturningVisitor();
        }
        
        // Personalize based on traffic source
        if (source) {
            personalizeBySource(source);
        }
        
        // Track this visit
        incrementVisitCount();
        if (!isReturning) {
            markAsVisited();
        }
    }
    
    function personalizeForReturningVisitor() {
        // Track returning visitor behavior
        const pricingCta = document.querySelector('a[href="#pricing"]');
        if (pricingCta) {
            pricingCta.addEventListener('click', () => {
                trackEvent('returning_visitor_pricing_click');
            });
        }
    }
    
    function personalizeBySource(source) {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        
        switch(source.toLowerCase()) {
            case 'linkedin':
                if (heroSubtitle) {
                    heroSubtitle.textContent = 'Join 20+ Indian professionals who\'ve automated their workflow. Built by professionals, for professionals.';
                }
                break;
                
            case 'google':
            case 'organic':
                if (heroSubtitle) {
                    heroSubtitle.textContent = 'India\'s most trusted AI automation service. Rated 5 stars by consultants, founders, and freelancers.';
                }
                break;
                
            case 'whatsapp':
                if (heroSubtitle) {
                    heroSubtitle.textContent = 'Thanks for your interest! Let\'s discuss how AI automation can help your specific workflow.';
                }
                break;
                
            case 'referral':
                if (heroSubtitle) {
                    heroSubtitle.textContent = 'Welcome! Your friend thought we could help. Let\'s see how much time we can save you.';
                }
                break;
        }
        
        // Track source for analytics
        trackEvent('visit_by_source', { source: source });
    }
    
    // ========================================
    // Smart Redirects
    // ========================================
    function handleSmartRedirects() {
        const path = window.location.pathname;
        const isReturning = isReturningVisitor();
        
    }
    
    // ========================================
    // Conversion Funnel Tracking
    // ========================================
    function initFunnelTracking() {
        // Track page views in funnel
        const path = window.location.pathname;
        
        if (path.includes('pricing') || document.getElementById('pricing')) {
            trackEvent('funnel_step', { step: 'pricing_viewed' });
        }
        
        // Track CTA clicks
        document.querySelectorAll('[data-cta]').forEach(cta => {
            cta.addEventListener('click', () => {
                const ctaName = cta.getAttribute('data-cta');
                trackEvent('funnel_step', { step: 'cta_clicked', cta: ctaName });
            });
        });
        
        // Track form starts
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', () => {
                if (!input.dataset.tracked) {
                    input.dataset.tracked = 'true';
                    trackEvent('funnel_step', { step: 'form_started', field: input.name });
                }
            });
        });
    }
    
    // ========================================
    // Referral Code Handling
    // ========================================
    function getReferralCode() {
        const params = new URLSearchParams(window.location.search);
        return params.get('ref') || localStorage.getItem('referral_code');
    }
    
    function storeReferralCode() {
        const ref = getReferralCode();
        if (ref) {
            localStorage.setItem('referral_code', ref);
            localStorage.setItem('referred_by', ref);
            trackEvent('referral_visit', { code: ref });
        }
    }
    
    // ========================================
    // A/B Testing Framework
    // ========================================
    function initABTesting() {
        // Check if user has a variant assigned
        let variant = localStorage.getItem('ab_variant');
        if (!variant) {
            // Assign random variant (50/50)
            variant = Math.random() < 0.5 ? 'A' : 'B';
            localStorage.setItem('ab_variant', variant);
        }
        
        // Apply variant
        if (variant === 'B') {
            applyVariantB();
        }
        
        trackEvent('ab_test_variant', { variant: variant });
    }
    
    function applyVariantB() {
        // Example: Different headline
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = 'Get 10+ Hours Back Every Week with AI Automation';
        }
    }
    
    // ========================================
    // Analytics Helper
    // ========================================
    function trackEvent(eventName, params = {}) {
        // Add visitor context to all events
        const context = {
            is_returning: isReturningVisitor(),
            visit_count: getVisitCount(),
            utm_source: localStorage.getItem('utm_source') || 'direct'
        };
        
        const fullParams = { ...params, ...context };
        
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, fullParams);
        }
        
        console.log('[Analytics]', eventName, fullParams);
    }
    
    // Make trackEvent global
    window.trackEvent = trackEvent;
    
    // ========================================
    // Initialize Everything
    // ========================================
    function init() {
        storeUTMParams();
        storeReferralCode();
        personalizeContent();
        handleSmartRedirects();
        initFunnelTracking();
        initABTesting();
        
        console.log('[Dynamic Content] Initialized');
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
