document.addEventListener('DOMContentLoaded', function () {
    // Constants
    const birthdate = new Date('1992-12-08T00:00:00');
    const retirementAge = 42;
    const countdownStartDate = new Date('2025-01-31T00:00:00');

    // Color pools
    const quadrantColors = ['#FF0000', '#00FF00', '#0000FF', '#FFD700', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
    const sectorColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];

    let lastQuadrantColor = null;
    let lastSectorColor = null;
    let currentQuadrantIndex = -1;  // Track last quadrant
    let currentSectorIndex = -1;    // Track last sector

    // Helper: Weeks between dates
    function getWeeksBetween(startDate, endDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
    }

    // Day counter
    function getDayPercentage() {
        const now = new Date();
        const currentHour = now.getHours();
        const dayPercentageElement = document.getElementById('day-percentage');
        
        if (currentHour >= 3 && currentHour < 9) {
            dayPercentageElement.classList.add('blink');
            return '--';
        } else {
            dayPercentageElement.classList.remove('blink');
        }

        const today9AM = new Date(now);
        today9AM.setHours(9, 0, 0, 0);
        const activeDayStart = now < today9AM ? 
            new Date(today9AM.getTime() - 86400000) : 
            today9AM;

        const activeDayEnd = new Date(activeDayStart.getTime() + 18 * 60 * 60 * 1000);
        const timePassed = Math.min(now - activeDayStart, activeDayEnd - activeDayStart);
        return ((timePassed / (18 * 60 * 60 * 1000)) * 100).toFixed(2);
    }

    // Week counter
    function getWeekPercentage() {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        startOfWeek.setHours(0, 0, 0, 0);
        const weekDuration = 7 * 24 * 60 * 60 * 1000;
        const timePassed = now - startOfWeek;
        return ((timePassed / weekDuration) * 100).toFixed(2);
    }

    // Clock color logic
    function getNonConsecutiveColor(colors, lastColor) {
        let newColor;
        do {
            newColor = colors[Math.floor(Math.random() * colors.length)];
        } while (newColor === lastColor);
        return newColor;
    }

    // 3-hour clock
    function updateThreeHourSegments() {
        const date = new Date();
        const newQuadrantIndex = Math.floor(date.getHours() / 3); // 0 to 7
        
        // Change color only if quadrant changed
        if (newQuadrantIndex !== currentQuadrantIndex) {
            currentQuadrantIndex = newQuadrantIndex;
            lastQuadrantColor = getNonConsecutiveColor(quadrantColors, lastQuadrantColor);
        }

        drawCircleSegments('threeHourCanvas', [
            { start: 0, end: Math.PI / 2 },
            { start: Math.PI / 2, end: Math.PI },
            { start: Math.PI, end: 1.5 * Math.PI },
            { start: 1.5 * Math.PI, end: 2 * Math.PI }
        ], newQuadrantIndex % 4, [lastQuadrantColor, '#ddd', '#ddd', '#ddd']);
    }

   function updateTenMinuteIntervals() {
    const date = new Date();
    // 1. Changed from 10 to 20 minutes division
    const newSectorIndex = Math.floor(date.getMinutes() / 20); // Now 0-2
    
    if (newSectorIndex !== currentSectorIndex) {
        currentSectorIndex = newSectorIndex;
        lastSectorColor = getNonConsecutiveColor(sectorColors, lastSectorColor);
    }

    // 2. Updated segments for 3 sectors (120deg each)
    drawCircleSegments('tenMinuteCanvas', [
        { start: 0, end: 2 * Math.PI / 3 },
        { start: 2 * Math.PI / 3, end: 4 * Math.PI / 3 },
        { start: 4 * Math.PI / 3, end: 2 * Math.PI }
    ], newSectorIndex, 
    // 3. Updated colors array length to match 3 sectors
    [lastSectorColor, '#ddd', '#ddd']); 
}

    // Canvas drawing
    function setupCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }

        return canvas;
    }

    function drawCircleSegments(canvasId, segments, highlightIndex, colors) {
        const canvas = setupCanvas(canvasId);
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;

        segments.forEach((segment, index) => {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, segment.start - Math.PI / 2, segment.end - Math.PI / 2, false);
            ctx.closePath();
            ctx.strokeStyle = '#0000FF';
            ctx.stroke();

            if (index === highlightIndex) {
                ctx.fillStyle = colors[0];
                ctx.fill();
            }
        });
    }

    // Life overview
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

    // Update every second
    setInterval(() => {
        updateLifeOverview();
        document.getElementById('day-percentage').textContent = getDayPercentage();
        document.getElementById('week-percentage').textContent = getWeekPercentage();
    }, 1000);

    // Update clocks every minute
    setInterval(updateThreeHourSegments, 60000);
    setInterval(updateTenMinuteIntervals, 60000);
});
