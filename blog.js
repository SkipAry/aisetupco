// Blog Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initCategoryFilter();
    initLoadMore();
    initAnalytics();
});

// Category Filter
function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            blogCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Track filter
            trackEvent('blog_category_filter', { category: category });
        });
    });
}

// Load More (placeholder functionality)
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', () => {
        trackEvent('blog_load_more');
        
        // For now, just show a message
        loadMoreBtn.textContent = 'More posts coming soon!';
        loadMoreBtn.disabled = true;
        
        setTimeout(() => {
            loadMoreBtn.textContent = 'Load More Posts';
            loadMoreBtn.disabled = false;
        }, 3000);
    });
}

// Analytics
function initAnalytics() {
    // Track blog post clicks
    document.querySelectorAll('.blog-card-link, .featured-card').forEach(link => {
        link.addEventListener('click', (e) => {
            const title = link.querySelector('h2, h3').textContent;
            trackEvent('blog_post_click', { title: title });
        });
    });
    
    // Track newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form-inline');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', () => {
            trackEvent('blog_newsletter_subscribe');
        });
    }
}

// Track Event Helper
function trackEvent(eventName, params = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, params);
    }
    console.log('[Analytics]', eventName, params);
}

// Fade in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
