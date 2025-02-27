document.addEventListener('DOMContentLoaded', function () {
    // Constants
    const birthdate = new Date('1992-12-08T00:00:00');
    const retirementAge = 42;
    const countdownStartDate = new Date('2025-01-31T00:00:00');

    // Function to generate random colors
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Generate random colors for both clocks
    let lastQuadrantColor = null;
    let lastSectorColor = null;
    let currentQuadrantIndex = -1;
    let currentSectorIndex = -1;

    // Helper function to get a non-consecutive and non-matching color
    function getNonConsecutiveColor(colors, lastColor, otherClockColor) {
        let newColor;
        do {
            newColor = colors[Math.floor(Math.random() * colors.length)];
        } while (newColor === lastColor || newColor === otherClockColor);
        return newColor;
    }

    // 3-hour clock
    function updateThreeHourSegments() {
        const date = new Date();
        const newQuadrantIndex = Math.floor(date.getHours() / 3); // 0 to 7

        // Change color only if quadrant changed
        if (newQuadrantIndex !== currentQuadrantIndex) {
            currentQuadrantIndex = newQuadrantIndex;
            lastQuadrantColor = getNonConsecutiveColor(
                Array.from({ length: 12 }, () => getRandomColor()), // Generate 12 random colors
                lastQuadrantColor,
                lastSectorColor // Ensure it doesn't match the 20-minute interval color
            );
        }

        drawCircleSegments('threeHourCanvas', [
            { start: 0, end: Math.PI / 2 },
            { start: Math.PI / 2, end: Math.PI },
            { start: Math.PI, end: 1.5 * Math.PI },
            { start: 1.5 * Math.PI, end: 2 * Math.PI }
        ], newQuadrantIndex % 4, [lastQuadrantColor, '#ddd', '#ddd', '#ddd']);
    }

    // 20-minute clock
    function updateTenMinuteIntervals() {
        const date = new Date();
        const newSectorIndex = Math.floor(date.getMinutes() / 20); // 0 to 2

        // Change color only if sector changed
        if (newSectorIndex !== currentSectorIndex) {
            currentSectorIndex = newSectorIndex;
            lastSectorColor = getNonConsecutiveColor(
                Array.from({ length: 12 }, () => getRandomColor()), // Generate 12 random colors
                lastSectorColor,
                lastQuadrantColor // Ensure it doesn't match the 3-hour segment color
            );
        }

        drawCircleSegments('tenMinuteCanvas', [
            { start: 0, end: 2 * Math.PI / 3 },
            { start: 2 * Math.PI / 3, end: 4 * Math.PI / 3 },
            { start: 4 * Math.PI / 3, end: 2 * Math.PI }
        ], newSectorIndex, [lastSectorColor, '#ddd', '#ddd']);
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
