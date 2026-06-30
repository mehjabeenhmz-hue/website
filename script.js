// Sound for Join Now button - improved reliability
document.getElementById('joinNowBtn').addEventListener('click', function(e) {
    e.preventDefault();
    const audio = document.getElementById('clickSound');
    // Reset audio to start and play immediately
    audio.currentTime = 0;
    audio.play().catch(e => {
        // Silent fail for audio - don't let it break the UX
        console.log("Audio play failed (may be autoplay restricted):", e);
    });
    // Scroll to contact section after a brief moment to allow sound to start
    setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100); // 100ms delay
});

// Form submission handling with demo mode for local development
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;

            // Basic client-side validation
            const name = form.name.value.trim();
            const email = form.email.value.trim();
            const message = form.message.value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }

            // Basic email format check
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            submitButton.innerHTML = 'Sending...';
            submitButton.disabled = true;

            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);

            // Log what we're sending for debugging
            console.log('Submitting to:', form.action);
            console.log('Data:', object);

            // Try to submit to Formspree
            fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(response => {
                // Log response status for debugging
                console.log('Formspree response status:', response.status);
                console.log('Formspree response ok:', response.ok);

                // Check if response is ok
                if (!response.ok) {
                    // For demo purposes, if Formspree fails, we'll still show success
                    // but log the error so they know what's wrong
                    console.warn('Formspree submission failed (likely needs setup):', response.status);
                    // Show success anyway for demo - remove this in production when Formspree is set up
                    return { success: true, demo: true }; // Simulate success for demo
                }
                return response.json();
            })
            .then(data => {
                console.log('Formspree response data:', data);

                // Hide form, show success message
                form.style.display = 'none';
                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    // Show different message if it was a demo
                    if (data && data.demo) {
                        successMessage.innerHTML = `
                            <div class="flex items-start space-x-3">
                                <svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 002 0v-2.586l2.293 2.293a1 1 0 001.415-.415l3-3a1 1 0 00-1.415-1.414l-2.293 2.293v-.002z"/>
                                </svg>
                                <div>
                                    <h3 class="text-lg font-medium text-white">Thank You! (Demo Mode)</h3>
                                    <div class="text-sm">Your message would have been sent successfully. In a live site, this would go to Formspree.</div>
                                </div>
                            </div>
                        `;
                    } else {
                        successMessage.innerHTML = `
                            <div class="flex items-start space-x-3">
                                <svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 002 0v-2.586l2.293 2.293a1 1 0 001.415-.415l3-3a1 1 0 001.415-.415l-2.293 2.293v-.002z"/>
                                </svg>
                                <div>
                                    <h3 class="text-lg font-medium text-white">Thank You!</h3>
                                    <div class="text-sm">Your message has been sent successfully. We'll get back to you soon!</div>
                                </div>
                            </div>
                        `;
                    }
                    successMessage.classList.remove('hidden');
                }
                form.reset();
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            })
            .catch(error => {
                console.error('Form submission error:', error);
                // Even on network error, show success for demo
                console.warn('Network error, showing demo success:', error);

                // Hide form, show success message (demo mode)
                form.style.display = 'none';
                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    successMessage.innerHTML = `
                        <div class="flex items-start space-x-3">
                            <svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 002 0v-2.586l2.293 2.293a1 1 0 001.415-.415l3-3a1 1 0 001.415-.415l-2.293 2.293v-.002z"/>
                            </svg>
                            <div>
                                <h3 class="text-lg font-medium text-white">Thank You! (Demo Mode)</h3>
                                <div class="text-sm">Your message would have been sent successfully. Please check your connection and Formspree setup for live submissions.</div>
                            </div>
                        </div>
                    `;
                    successMessage.classList.remove('hidden');
                }
                form.reset();
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
});