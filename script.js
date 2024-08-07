document.addEventListener('DOMContentLoaded', function () {
    const totalWeeks = 2600;
    const weeksLived = 1652 + 3 / 7; // Adding the extra days as fractions of a week

    function updateLifeOverview() {
        const weeksLeft = totalWeeks - weeksLived;
        const percentageWasted = (weeksLived / totalWeeks) * 100;
        document.getElementById('weeks-left').textContent = 'Weeks Left: ' + Math.floor(weeksLeft);
        document.getElementById('percentage-wasted').textContent = 'Percentage of Life Wasted: ' + percentageWasted.toFixed(2) + '%';
    }

    function setupCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        canvas.width = 300; // Width of the canvas
        canvas.height = 300; // Height of the canvas
        return canvas;
    }

    function drawCircleSegments(canvasId, segments, highlightIndex, colors) {
        const canvas = setupCanvas(canvasId);
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = centerX - 10; // slightly smaller to fit canvas

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for redrawing
        ctx.lineWidth = 2; // Set line width for circle border

        segments.forEach((segment, index) => {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, segment.start - Math.PI / 2, segment.end - Math.PI / 2, false); // Adjust by -90 degrees to start at 12 o'clock
            ctx.closePath();
            ctx.strokeStyle = '#0000FF'; // Default circle border color
            ctx.stroke(); // Draw circle border
            if (index === highlightIndex) {
                ctx.fillStyle = colors[index % colors.length]; // Fill highlighted segment
                ctx.fill();
            }
        });
    }

    function updateThreeHourSegments() {
        const date = new Date();
        const currentHour = date.getHours();
        const segmentIndex = Math.floor(currentHour / 3) % 4; // Correct segment calculation, use modulo for circular array
        const segments = [
            { start: 0, end: Math.PI / 2 },
            { start: Math.PI / 2, end: Math.PI },
            { start: Math.PI, end: 1.5 * Math.PI },
            { start: 1.5 * Math.PI, end: 2 * Math.PI }
        ];
        const colors = ['red', 'green', 'blue', 'yellow']; // Different colors for each segment
        drawCircleSegments('threeHourCanvas', segments, segmentIndex, colors);
    }

    function updateTenMinuteIntervals() {
        const date = new Date();
        const currentMinute = date.getMinutes();
        const segmentIndex = Math.floor(currentMinute / 10); // Correct calculation for the 10-minute segments
        const segments = [
            { start: 0, end: Math.PI / 3 },
            { start: Math.PI / 3, end: 2 * Math.PI / 3 },
            { start: 2 * Math.PI / 3, end: Math.PI },
            { start: Math.PI, end: 4 * Math.PI / 3 },
            { start: 4 * Math.PI / 3, end: 5 * Math.PI / 3 },
            { start: 5 * Math.PI / 3, end: 2 * Math.PI }
        ];
        const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange']; // Different colors for each segment
        drawCircleSegments('tenMinuteCanvas', segments, segmentIndex, colors);
    }

    updateLifeOverview();
    updateThreeHourSegments();
    updateTenMinuteIntervals();

    // Update segments every minute to ensure accuracy
    setInterval(updateThreeHourSegments, 60000);
    setInterval(updateTenMinuteIntervals, 60000);
});
