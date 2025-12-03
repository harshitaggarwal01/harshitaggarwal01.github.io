document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    // --- Mobile Menu ---
    hamburgerBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // --- Timeline Logic ---
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            timelineItems.forEach(otherItem => {
                if (otherItem !== this) otherItem.classList.remove('active');
            });
            this.classList.toggle('active');
        });
    });

    // --- Infinite Carousel Logic ---
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    // Clone slides for infinite effect (Clone first 2 to end, last 2 to start)
    // We clone 2 because we are showing roughly 2 slides at a time
    const cloneCount = 2; 
    
    const firstClones = slides.slice(0, cloneCount).map(slide => slide.cloneNode(true));
    const lastClones = slides.slice(-cloneCount).map(slide => slide.cloneNode(true));

    // Append/Prepend clones
    firstClones.forEach(clone => {
        clone.classList.add('clone');
        track.appendChild(clone);
    });
    lastClones.reverse().forEach(clone => {
        clone.classList.add('clone');
        track.insertBefore(clone, track.firstChild);
    });

    // Re-select all slides including clones
    const allSlides = Array.from(track.children);
    
    let currentIndex = cloneCount; // Start at the first real slide
    let cardWidth = allSlides[0].getBoundingClientRect().width;
    let gap = 32; // 2rem = 32px (approx) - must match CSS gap
    
    // Function to set position
    const setTrackPosition = (index, transition = true) => {
        // Recalculate width in case of resize
        cardWidth = allSlides[0].getBoundingClientRect().width;
        
        if (!transition) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s ease-in-out';
        }
        
        const moveAmount = (cardWidth + gap) * index;
        // Center alignment adjustment: 
        // We want the left edge of the card 'index' to be slightly offset if we want centering,
        // but for "glimpse" effect, usually simple translation works if CSS handles sizing.
        // Let's just translate:
        track.style.transform = `translateX(-${moveAmount}px)`;
    };

    // Initial Set
    // Wait a moment for layout to stabilize
    setTimeout(() => {
        cardWidth = allSlides[0].getBoundingClientRect().width; // Get correct width after render
        setTrackPosition(currentIndex, false); 
    }, 100);

    // Next Button
    nextBtn.addEventListener('click', () => {
        if (currentIndex >= allSlides.length - cloneCount) return; // Prevent clicking too fast
        currentIndex++;
        setTrackPosition(currentIndex);
    });

    // Prev Button
    prevBtn.addEventListener('click', () => {
        if (currentIndex <= 0) return;
        currentIndex--;
        setTrackPosition(currentIndex);
    });

    // Handle "Jump" on Transition End
    track.addEventListener('transitionend', () => {
        const totalRealSlides = slides.length;
        
        // If we scrolled past the last real slide to a clone
        if (currentIndex >= totalRealSlides + cloneCount) {
            currentIndex = cloneCount; // Jump back to first real slide
            setTrackPosition(currentIndex, false);
        }
        
        // If we scrolled before the first real slide to a clone
        if (currentIndex < cloneCount) {
            currentIndex = totalRealSlides + cloneCount - 1; // Jump to last real slide
            setTrackPosition(currentIndex, false);
        }
    });

    // Resize Handler
    window.addEventListener('resize', () => {
        cardWidth = allSlides[0].getBoundingClientRect().width;
        setTrackPosition(currentIndex, false);
    });

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active');
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
