document.addEventListener('DOMContentLoaded', function () {
    // Constants
    const birthdate = new Date('1992-12-08');
    const retirementAge = 42;
    const countdownStartDate = new Date('2025-01-31');
    
    // Color pools (8 colors for quadrants, 6 for sectors)
    const quadrantColors = ['#FF0000', '#00FF00', '#0000FF', '#FFD700', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
    const sectorColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
    let lastQuadrantColor = null;
    let lastSectorColor = null;

    // Helper: Weeks between dates
    function getWeeksBetween(startDate, endDate) {
        return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24 * 7));
    }

    // Day counter (9 AM to 3 AM)
    function getDayPercentage() {
        const now = new Date();
        const currentHour = now.getHours();
        const dayPercentageElement = document.getElementById('day-percentage');
        
        // Inactive hours (3 AM - 9 AM)
        if (currentHour >= 3 && currentHour < 9) {
            dayPercentageElement.classList.add('blink');
            return '--';
        } else {
            dayPercentageElement.classList.remove('blink');
        }

        // Active day calculation
        const today9AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
        let activeDayStart = now < today9AM ? 
            new Date(today9AM.getTime() - 86400000) : // Yesterday 9 AM
            today9AM;

        const activeDayEnd = new Date(activeDayStart.getTime() + 18 * 60 * 60 * 1000); // +18 hours
        const timePassed = Math.min(now - activeDayStart, activeDayEnd - activeDayStart);
        return ((timePassed / (18 * 60 * 60 * 1000)) * 100).toFixed(2);
    }

    // Week counter (Monday 00:00 to Sunday 23:59)
    function getWeekPercentage() {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7)); // Monday
        startOfWeek.setHours(0, 0, 0, 0);
        const weekProgress = now - startOfWeek;
        return ((weekProgress / (7 * 24 * 60 * 60 * 1000)) * 100).toFixed(2);
    }

    // Clock color logic (no consecutive repeats)
    function getNonConsecutiveColor(colors, lastColor) {
        let newColor;
        do {
            newColor = colors[Math.floor(Math.random() * colors.length)];
        } while (newColor === lastColor);
        return newColor;
    }

    // 3-hour quadrant clock
    function updateThreeHourSegments() {
        const date = new Date();
        const currentHour = date.getHours();
        const segmentIndex = Math.floor(currentHour / 3) % 4;
        
        // Generate 4 unique colors
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

    // 10-minute sector clock
    function updateTenMinuteIntervals() {
        const date = new Date();
        const currentMinute = date.getMinutes();
        const segmentIndex = Math.floor(currentMinute / 10);
        
        // Generate 6 unique colors
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

    // Canvas drawing (unchanged)
    function setupCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        canvas.width = 300;
        canvas.height = 300;
        return canvas;
    }

    function drawCircleSegments(canvasId, segments, highlightIndex, colors) {
        const canvas = setupCanvas(canvasId);
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = centerX - 10;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;

        segments.forEach((segment, index) => {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, segment.start - Math.PI/2, segment.end - Math.PI/2, false);
            ctx.closePath();
            ctx.strokeStyle = '#0000FF';
            ctx.stroke();
            if (index === highlightIndex) {
                ctx.fillStyle = colors[index % colors.length];
                ctx.fill();
            }
        });
    }

    // Life overview (weeks left and life wasted)
    function updateLifeOverview() {
        const today = new Date();
        const weeksPassed = getWeeksBetween(countdownStartDate, today);
        const weeksLeft = 400 - weeksPassed;
        document.getElementById('weeks-left').textContent = `Weeks Left: ${Math.max(weeksLeft, 0)}`;
        
        const totalLifeWeeks = retirementAge * 52;
        const weeksLived = getWeeksBetween(birthdate, today);
        const lifeWasted = (weeksLived / totalLifeWeeks * 100).toFixed(2);
        document.getElementById('percentage-wasted').textContent = `Percentage of Life Wasted: ${lifeWasted}%`;
    }

    // Initialize
    updateLifeOverview();
    updateThreeHourSegments();
    updateTenMinuteIntervals();

    // Update counters every second, clocks every minute
    setInterval(() => {
        document.getElementById('day-percentage').textContent = getDayPercentage();
        document.getElementById('week-percentage').textContent = getWeekPercentage();
        updateLifeOverview();
    }, 1000);
    setInterval(updateThreeHourSegments, 60000);
    setInterval(updateTenMinuteIntervals, 60000);
});
