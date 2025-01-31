document.addEventListener('DOMContentLoaded', function () {
    // Constants and Color Pools
    const birthdate = new Date('1992-12-08');
    const retirementAge = 42;
    const countdownStartDate = new Date('2025-01-31');
    
    // Color configuration
    const quadrantColors = ['#FF0000', '#00FF00', '#0000FF', '#FFD700', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
    const sectorColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
    let lastQuadrantColor = null;
    let lastSectorColor = null;

    // Counter functions
    function getDayPercentage() {
        const now = new Date();
        const currentHour = now.getHours();
        
        // Handle inactive hours (3 AM - 9 AM)
        if (currentHour >= 3 && currentHour < 9) {
            document.getElementById('day-percentage').classList.add('blink');
            return '--';
        }
        document.getElementById('day-percentage').classList.remove('blink');

        // Calculate active day progress (9 AM - 3 AM)
        const today9AM = new Date(now);
        today9AM.setHours(9, 0, 0, 0);
        
        const activeDayStart = now < today9AM ? 
            new Date(today9AM.setDate(today9AM.getDate() - 1)) : 
            today9AM;

        const activeDayEnd = new Date(activeDayStart);
        activeDayEnd.setHours(activeDayStart.getHours() + 18);

        const elapsed = Math.min(now - activeDayStart, activeDayEnd - activeDayStart);
        return ((elapsed / (18 * 60 * 60 * 1000)) * 100).toFixed(2);
    }

    function getWeekPercentage() {
        const now = new Date();
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        monday.setHours(0, 0, 0, 0);
        
        const weekProgress = now - monday;
        return ((weekProgress / (7 * 24 * 60 * 60 * 1000)) * 100).toFixed(2);
    }

    // Clock functions with dynamic colors
    function getNonConsecutiveColor(pool, lastColor) {
        let newColor;
        do {
            newColor = pool[Math.floor(Math.random() * pool.length)];
        } while (newColor === lastColor);
        return newColor;
    }

    function updateThreeHourSegments() {
        const date = new Date();
        const currentHour = date.getHours();
        const segmentIndex = Math.floor(currentHour / 3) % 4;
        
        // Generate new colors ensuring no consecutive duplicates
        const colors = [];
        for (let i = 0; i < 4; i++) {
            lastQuadrantColor = getNonConsecutiveColor(quadrantColors, lastQuadrantColor);
            colors.push(lastQuadrantColor);
        }

        drawCircleSegments('threeHourCanvas', [
            { start: 0, end: Math.PI/2 },
            { start: Math.PI/2, end: Math.PI },
            { start: Math.PI, end: 1.5*Math.PI },
            { start: 1.5*Math.PI, end: 2*Math.PI }
        ], segmentIndex, colors);
    }

    function updateTenMinuteIntervals() {
        const date = new Date();
        const currentMinute = date.getMinutes();
        const segmentIndex = Math.floor(currentMinute / 10);
        
        // Generate new colors for sectors
        const colors = [];
        for (let i = 0; i < 6; i++) {
            lastSectorColor = getNonConsecutiveColor(sectorColors, lastSectorColor);
            colors.push(lastSectorColor);
        }

        drawCircleSegments('tenMinuteCanvas', [
            { start: 0, end: Math.PI/3 },
            { start: Math.PI/3, end: 2*Math.PI/3 },
            { start: 2*Math.PI/3, end: Math.PI },
            { start: Math.PI, end: 4*Math.PI/3 },
            { start: 4*Math.PI/3, end: 5*Math.PI/3 },
            { start: 5*Math.PI/3, end: 2*Math.PI }
        ], segmentIndex, colors);
    }

    // Existing functions (keep these unchanged)
    function setupCanvas(canvasId) { /* ... */ }
    function drawCircleSegments(canvasId, segments, highlightIndex, colors) { /* ... */ }
    function updateLifeOverview() { /* ... */ }

    // Initialize with 1 second interval for smoother blink
    setInterval(() => {
        document.getElementById('day-percentage').textContent = getDayPercentage();
        document.getElementById('week-percentage').textContent = getWeekPercentage();
        updateLifeOverview();
    }, 1000);
    
    updateThreeHourSegments();
    updateTenMinuteIntervals();
    setInterval(updateThreeHourSegments, 60000);
    setInterval(updateTenMinuteIntervals, 60000);
});
