let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let createSquareBtn = document.getElementById("createSquareBtn");
let deleteSquareBtn = document.getElementById("deleteSquareBtn");
let resetCanvasBtn = document.getElementById("resetCanvasBtn");
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
createSquareBtn.addEventListener("click", function () {
    var xPosition = parseInt(document.getElementById("xPosition").value, 10);
    var yPosition = parseInt(document.getElementById("yPosition").value, 10);
    var squareWidth = parseInt(document.getElementById("squareWidth").value, 10);
    var squareHeight = parseInt(document.getElementById("squareHeight").value, 10);
    var squareColor = document.getElementById("squareColor").value;
    var squareName = document.getElementById("squareName").value;

    // Check for overlap with existing squares
    if (!checkOverlap(xPosition, yPosition, squareWidth, squareHeight)) {
        drawSquare(xPosition, yPosition, squareWidth, squareHeight, squareColor, squareName);
        squares.push({ x: xPosition, y: yPosition, width: squareWidth, height: squareHeight, color: squareColor, name: squareName });
        saveSquares(); // Save the squares to localStorage
        createDeleteButton(); // Create the delete button for the latest square
        clearForm();
    } else {
        alert("Overlap detected. Please choose a different position or size.");
    }
});

// Add event listener for canvas clicks
canvas.addEventListener("click", function (event) {
    var mouseX = event.clientX - canvas.getBoundingClientRect().left;
    var mouseY = event.clientY - canvas.getBoundingClientRect().top;

    // Check if the click is inside any of the squares
    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        if (
            mouseX >= square.x &&
            mouseX <= square.x + square.width &&
            mouseY >= square.y &&
            mouseY <= square.y + square.height
        ) {
            // Populate input fields with square values
            document.getElementById("xPosition").value = square.x;
            document.getElementById("yPosition").value = square.y;
            document.getElementById("squareWidth").value = square.width;
            document.getElementById("squareHeight").value = square.height;
            document.getElementById("squareColor").value = square.color;
            document.getElementById("squareName").value = square.name;

            // Enable the delete button
            deleteSquareBtn.disabled = false;

            // Exit the loop once a square is found
            break;
        }
    }
});

// Add event listener for delete button clicks
deleteSquareBtn.addEventListener("click", function () {
    // Get the values of the selected square
    var xToDelete = parseInt(document.getElementById("xPosition").value, 10);
    var yToDelete = parseInt(document.getElementById("yPosition").value, 10);
    var widthToDelete = parseInt(document.getElementById("squareWidth").value, 10);
    var heightToDelete = parseInt(document.getElementById("squareHeight").value, 10);

    // Find the index of the square to delete
    var indexToDelete = -1;
    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        if (square.x === xToDelete && square.y === yToDelete && square.width === widthToDelete && square.height === heightToDelete) {
            indexToDelete = i;
            break;
        }
    }

    // Delete the square if found
    if (indexToDelete !== -1) {
        squares.splice(indexToDelete, 1);
        redrawSquares(); // Redraw the canvas after deleting the square
        saveSquares(); // Save the updated squares to localStorage
        clearForm(); // Clear the form fields
        deleteSquareBtn.disabled = true; // Disable the delete button after deletion
    } else {
        alert("Error: Selected square not found.");
    }
});

// Add event listener for reset canvas button clicks
resetCanvasBtn.addEventListener("click", function () {
    // Clear the squares array
    squares = [];

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Disable the delete button
    deleteSquareBtn.disabled = true;

    // Save the updated squares to localStorage
    saveSquares();
});

function drawSquare(x, y, width, height, color, name) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    context.strokeRect(x, y, width, height);

    context.fillStyle = "#000";
    context.font = "12px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    var centerX = x + width / 2;
    var centerY = y + height / 2;

    context.fillText(name, centerX, centerY);
}

function createDeleteButton() {
    // Create a delete button for the latest square
    deleteSquareBtn.disabled = false;
}

function checkOverlap(x, y, width, height) {
    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        if (
            x < square.x + square.width &&
            x + width > square.x &&
            y < square.y + square.height &&
            y + height > square.y
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
        drawSquare(square.x, square.y, square.width, square.height, square.color, square.name);
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
        redrawSquares(); // Redraw squares after loading
        // Create delete buttons for each loaded square
        for (var i = 0; i < squares.length; i++) {
            createDeleteButton();
        }
    }
}

function clearForm() {
    document.getElementById("xPosition").value = "";
    document.getElementById("yPosition").value = "";
    document.getElementById("squareWidth").value = "";
    document.getElementById("squareHeight").value = "";
    document.getElementById("squareColor").value = "#3498db";
    document.getElementById("squareName").value = "";
}
