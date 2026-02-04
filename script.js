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
