document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    // --- Mobile Menu ---
    hamburgerBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // --- 3D SKILLS GLOBE (TagCloud.js) ---
    const myTags = [
        'Python', 'Java', 'C++', 'JavaScript',
        'TypeScript', 'React', 'Angular', 'Node.js',
        'Spring Boot', 'AWS', 'Docker', 'Kubernetes',
        'PyTorch', 'TensorFlow', 'OpenCV', 'Git',
        'SQL', 'MongoDB', 'Redis', 'Kafka',
        'Jenkins', 'CI/CD', 'Microservices'
    ];

    // Function to determine radius based on current screen width
    function getGlobeRadius() {
        const width = window.innerWidth;
        if (width > 1600) return 600; // Large Desktops
        if (width > 1200) return 500; // Standard Desktops
        if (width > 768) return 350;  // Tablets/Laptops
        return 220;                   // Mobile Phones
    }

    // Initialize the globe
    let globeRadius = getGlobeRadius();
    
    // We assign it to a variable in case we want to manipulate it later
    let myGlobe = TagCloud('.skill-globe', myTags, {
        radius: globeRadius,
        maxSpeed: 'fast',
        initSpeed: 'normal',
        direction: 135,
        keep: true
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

    const cloneCount = 2; 
    
    const firstClones = slides.slice(0, cloneCount).map(slide => slide.cloneNode(true));
    const lastClones = slides.slice(-cloneCount).map(slide => slide.cloneNode(true));

    firstClones.forEach(clone => {
        clone.classList.add('clone');
        track.appendChild(clone);
    });
    lastClones.reverse().forEach(clone => {
        clone.classList.add('clone');
        track.insertBefore(clone, track.firstChild);
    });

    const allSlides = Array.from(track.children);
    let currentIndex = cloneCount; 
    let cardWidth = allSlides[0].getBoundingClientRect().width;
    let gap = 32; 
    
    const setTrackPosition = (index, transition = true) => {
        cardWidth = allSlides[0].getBoundingClientRect().width;
        if (!transition) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s ease-in-out';
        }
        const moveAmount = (cardWidth + gap) * index;
        track.style.transform = `translateX(-${moveAmount}px)`;
    };

    setTimeout(() => {
        cardWidth = allSlides[0].getBoundingClientRect().width;
        setTrackPosition(currentIndex, false); 
    }, 100);

    nextBtn.addEventListener('click', () => {
        if (currentIndex >= allSlides.length - cloneCount) return; 
        currentIndex++;
        setTrackPosition(currentIndex);
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex <= 0) return;
        currentIndex--;
        setTrackPosition(currentIndex);
    });

    track.addEventListener('transitionend', () => {
        const totalRealSlides = slides.length;
        if (currentIndex >= totalRealSlides + cloneCount) {
            currentIndex = cloneCount; 
            setTrackPosition(currentIndex, false);
        }
        if (currentIndex < cloneCount) {
            currentIndex = totalRealSlides + cloneCount - 1; 
            setTrackPosition(currentIndex, false);
        }
    });

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
