let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let createSquareBtn = document.getElementById("createSquareBtn");

var window_height = window.innerHeight;
var window_width = window.innerWidth;

// Set the canvas size to be 80% of the window size
canvas.width = window_width * 0.8;
canvas.height = window_height * 0.8;

context.fillStyle = "#ff8"; // Set the fill color

// Draw a large empty square filling the entire canvas
context.clearRect(0, 0, canvas.width, canvas.height);
context.strokeRect(0, 0, canvas.width, canvas.height);

// Add event listener for button clicks
createSquareBtn.addEventListener("click", function() {
    // Generate random coordinates for the new square inside the big square
    var randomX = Math.random() * canvas.width;
    var randomY = Math.random() * canvas.height;

    // Draw a smaller square at the random coordinates
    drawSquare(randomX, randomY, 30); // You can adjust the size of the smaller square
});

// Function to draw a square at the specified coordinates
function drawSquare(x, y, size) {
    context.fillStyle = "#3498db"; // Set the fill color for the smaller square
    context.fillRect(x - size / 2, y - size / 2, size, size);
}
