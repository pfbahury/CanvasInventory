let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let createSquareBtn = document.getElementById("createSquareBtn");
let squareForm = document.getElementById("squareForm");
let squares = [];

var window_height = window.innerHeight;
var window_width = window.innerWidth;

// Set the canvas size to be 30% of the window width and 50% of the window height
canvas.width = window_width * 0.3;
canvas.height = window_height * 0.5;

// Load the saved squares from localStorage
loadSavedSquares();

// Draw the saved squares on the canvas
redrawSquares();

// Add event listener for button clicks
createSquareBtn.addEventListener("click", function() {
    var xPosition = parseInt(document.getElementById("xPosition").value, 10);
    var yPosition = parseInt(document.getElementById("yPosition").value, 10);
    var squareSize = parseInt(document.getElementById("squareSize").value, 10);
    var squareColor = document.getElementById("squareColor").value;
    var squareName = document.getElementById("squareName").value;

    if (!checkOverlap(xPosition, yPosition, squareSize)) {
        drawSquare(xPosition, yPosition, squareSize, squareColor, squareName);
        squares.push({ x: xPosition, y: yPosition, size: squareSize, color: squareColor, name: squareName });
        saveSquares(); // Save the squares to localStorage
        clearForm();
    } else {
        alert("Overlap detected. Please choose a different position or size.");
    }
});

// Add event listener for canvas clicks
canvas.addEventListener("click", function(event) {
    var mouseX = event.clientX - canvas.getBoundingClientRect().left;
    var mouseY = event.clientY - canvas.getBoundingClientRect().top;

    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        if (
            mouseX >= square.x &&
            mouseX <= square.x + square.size &&
            mouseY >= square.y &&
            mouseY <= square.y + square.size
        ) {
            document.getElementById("xPosition").value = square.x;
            document.getElementById("yPosition").value = square.y;
            document.getElementById("squareSize").value = square.size;
            document.getElementById("squareColor").value = square.color;
            document.getElementById("squareName").value = square.name;
            break;
        }
    }
});

function drawSquare(x, y, size, color, name) {
    context.fillStyle = color;
    context.fillRect(x, y, size, size);
    context.strokeRect(x, y, size, size);

    context.fillStyle = "#000";
    context.font = "12px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    var centerX = x + size / 2;
    var centerY = y + size / 2;

    context.fillText(name, centerX, centerY);
}

function createDeleteButton(square, index) {
    var existingButton = document.getElementById("deleteSquareBtn");
    if (existingButton) {
        existingButton.remove();
    }

    var deleteButton = document.createElement("button");
    deleteButton.id = "deleteSquareBtn";
    deleteButton.textContent = "Delete Square";
    deleteButton.style.position = "absolute";
    deleteButton.style.left = square.x + square.size + 10 + "px";
    deleteButton.style.top = square.y + "px";

    deleteButton.addEventListener("click", function() {
        squares.splice(index, 1);
        redrawSquares();
        deleteButton.remove();
        saveSquares(); // Save the squares to localStorage after deleting one
    });

    document.body.appendChild(deleteButton);
}

function checkOverlap(x, y, size) {
    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        if (
            x < square.x + square.size &&
            x + size > square.x &&
            y < square.y + square.size &&
            y + size > square.y
        ) {
            return true;
        }
    }
    return false;
}

function redrawSquares() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        drawSquare(square.x, square.y, square.size, square.color, square.name);
    }
}

function saveSquares() {
    // Save the squares array to localStorage
    localStorage.setItem("squares", JSON.stringify(squares));
}

function loadSavedSquares() {
    // Load the squares array from localStorage
    var savedSquares = localStorage.getItem("squares");
    if (savedSquares) {
        squares = JSON.parse(savedSquares);
    }
}

function clearForm() {
    document.getElementById("xPosition").value = "";
    document.getElementById("yPosition").value = "";
    document.getElementById("squareSize").value = "";
    document.getElementById("squareColor").value = "#3498db";
    document.getElementById("squareName").value = "";
}
