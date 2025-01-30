document.addEventListener('DOMContentLoaded', function () {
    // Constants for life calculations
    const birthdate = new Date('1992-12-08'); // Your birthdate
    const retirementAge = 42; // Retirement at 42 years
    const retirementDate = new Date(birthdate.getFullYear() + retirementAge, birthdate.getMonth(), birthdate.getDate()); // Retirement date: Dec 8, 2034
    const countdownStartDate = new Date('2025-01-31'); // Start date for 400-week countdown

    // Function to calculate weeks between two dates
    function getWeeksBetween(startDate, endDate) {
        const timeDiff = endDate - startDate;
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
    }

    // Update life overview (weeks left and percentage wasted)
    function updateLifeOverview() {
        const today = new Date(); // Current date
        
        // Calculate weeks left until retirement (400 weeks from Jan 31, 2025)
        const weeksPassedSinceCountdownStart = getWeeksBetween(countdownStartDate, today);
        const weeksLeft = 400 - weeksPassedSinceCountdownStart;

        // Calculate percentage of life "wasted" (used) until today
        const totalLifeWeeks = retirementAge * 52; // 42 years in weeks
        const weeksPassedSinceBirth = getWeeksBetween(birthdate, today);
        const percentageWasted = (weeksPassedSinceBirth / totalLifeWeeks) * 100;

        // Update the display
        document.getElementById('weeks-left').textContent = `Weeks Left: ${Math.max(weeksLeft, 0)}`;
        document.getElementById('percentage-wasted').textContent = `Percentage of Life Wasted: ${percentageWasted.toFixed(2)}%`;
    }

    // Clock functions (unchanged from your original code)
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
            ctx.arc(centerX, centerY, radius, segment.start - Math.PI / 2, segment.end - Math.PI / 2, false);
            ctx.closePath();
            ctx.strokeStyle = '#0000FF';
            ctx.stroke();
            if (index === highlightIndex) {
                ctx.fillStyle = colors[index % colors.length];
                ctx.fill();
            }
        });
    }

    function updateThreeHourSegments() {
        const date = new Date();
        const currentHour = date.getHours();
        const segmentIndex = Math.floor(currentHour / 3) % 4;
        const segments = [
            { start: 0, end: Math.PI / 2 },
            { start: Math.PI / 2, end: Math.PI },
            { start: Math.PI, end: 1.5 * Math.PI },
            { start: 1.5 * Math.PI, end: 2 * Math.PI }
        ];
        const colors = ['red', 'green', 'blue', 'yellow'];
        drawCircleSegments('threeHourCanvas', segments, segmentIndex, colors);
    }

    function updateTenMinuteIntervals() {
        const date = new Date();
        const currentMinute = date.getMinutes();
        const segmentIndex = Math.floor(currentMinute / 10);
        const segments = [
            { start: 0, end: Math.PI / 3 },
            { start: Math.PI / 3, end: 2 * Math.PI / 3 },
            { start: 2 * Math.PI / 3, end: Math.PI },
            { start: Math.PI, end: 4 * Math.PI / 3 },
            { start: 4 * Math.PI / 3, end: 5 * Math.PI / 3 },
            { start: 5 * Math.PI / 3, end: 2 * Math.PI }
        ];
        const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];
        drawCircleSegments('tenMinuteCanvas', segments, segmentIndex, colors);
    }

    // Initialize everything
    updateLifeOverview();
    updateThreeHourSegments();
    updateTenMinuteIntervals();

    // Update clock every minute
    setInterval(updateThreeHourSegments, 60000);
    setInterval(updateTenMinuteIntervals, 60000);

    // Update life stats every hour (optional)
    setInterval(updateLifeOverview, 3600000); // 1 hour
});
