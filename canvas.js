let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let createSquareBtn = document.getElementById("createSquareBtn");
let deleteSquareBtn = document.getElementById("deleteSquareBtn");
let resetCanvasBtn = document.getElementById("resetCanvasBtn");
let squareForm = document.getElementById("squareForm");
let squares = [];
let selectedSquare = null;

var window_height = window.innerHeight;
var window_width = window.innerWidth;

// Set the canvas size to be 30% of the window width and 50% of the window height
canvas.width = 500
canvas.height = 400

// Load the saved squares from localStorage
loadSavedSquares();

// Draw the saved squares on the canvas
redrawSquares();

// Add event listener for button clicks
// Add event listener for button clicks
createSquareBtn.addEventListener("click", function () {
    var xPosition = parseInt(document.getElementById("xPosition").value, 10);
    var yPosition = parseInt(document.getElementById("yPosition").value, 10);
    var squareWidth = parseInt(document.getElementById("squareWidth").value, 10);
    var squareHeight = parseInt(document.getElementById("squareHeight").value, 10);
    var squareColor = document.getElementById("squareColor").value;
    var squareName = document.getElementById("squareName").value;
    var minDistance = 50;

    // Check if the square is within the canvas dimensions
    if (xPosition < 0 || yPosition < 0 || xPosition + squareWidth > canvas.width || yPosition + squareHeight > canvas.height) {
        alert("Square dimensions exceed canvas boundaries. Please choose a different position or size.");
        return;
    }

    // If a square is selected, update its properties
    if (selectedSquare) {
        // Check for overlap with other squares after updating
        if (!checkOverlap(xPosition, yPosition, squareWidth, squareHeight, selectedSquare, minDistance)) {
            // Update the selected square and redraw
            selectedSquare.x = xPosition;
            selectedSquare.y = yPosition;
            selectedSquare.width = squareWidth;
            selectedSquare.height = squareHeight;
            selectedSquare.color = squareColor;
            selectedSquare.name = squareName;

            redrawSquares();
            saveSquares();
            clearForm();
            deleteSquareBtn.disabled = true;
            selectedSquare = null;
        } else {
            alert("Overlap detected or minimum distance violation. Please choose a different position or size.");
            // Reset the selected square to its previous state
            redrawSquares();
            clearForm();
        }
    } else {
        // If no square is selected, create a new square as before
        // Check for overlap with existing squares and canvas dimensions
        if (!checkOverlap(xPosition, yPosition, squareWidth, squareHeight, null, minDistance) &&
            xPosition >= 0 && yPosition >= 0 && xPosition + squareWidth <= canvas.width && yPosition + squareHeight <= canvas.height) {
            // Draw the new square
            drawSquare(xPosition, yPosition, squareWidth, squareHeight, squareColor, squareName);
            squares.push({ x: xPosition, y: yPosition, width: squareWidth, height: squareHeight, color: squareColor, name: squareName });
            saveSquares(); // Save the squares to localStorage
            createDeleteButton(); // Create the delete button for the latest square
            clearForm();
        } else {
            alert("Overlap detected, minimum distance violation, or square dimensions exceed canvas boundaries. Please choose a different position or size.");
        }
    }
});


// Add event listener for canvas clicks
canvas.addEventListener("click", function (event) {
    var mouseX = event.clientX - canvas.getBoundingClientRect().left;
    var mouseY = event.clientY - canvas.getBoundingClientRect().top;

    // Check if the click is inside any of the squares
    var squareClicked = null;
    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        if (
            mouseX >= square.x &&
            mouseX <= square.x + square.width &&
            mouseY >= square.y &&
            mouseY <= square.y + square.height
        ) {
            squareClicked = square;
            break;
        }
    }

    // If a square is clicked, populate input fields and enable delete button
    if (squareClicked) {
        document.getElementById("xPosition").value = squareClicked.x;
        document.getElementById("yPosition").value = squareClicked.y;
        document.getElementById("squareWidth").value = squareClicked.width;
        document.getElementById("squareHeight").value = squareClicked.height;
        document.getElementById("squareColor").value = squareClicked.color;
        document.getElementById("squareName").value = squareClicked.name;
        deleteSquareBtn.disabled = false;

        // Set the selected square
        selectedSquare = squareClicked;
    } else {
        // If no square is clicked, clear input fields, disable delete button, and unselect square
        clearForm();
        deleteSquareBtn.disabled = true;
        selectedSquare = null;
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

        // Clear the selected square
        selectedSquare = null;
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

    // Redraw the grid
    drawGrid();

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

function checkOverlap(x, y, width, height, currentSquare, minDistance) {
    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        // Skip checking against the current square (useful when updating)
        if (currentSquare && currentSquare === square) {
            continue;
        }

        // Calculate the minimum distance
        var minDistanceX = (square.width + width) / 2 + minDistance;
        var minDistanceY = (square.height + height) / 2 + minDistance;

        if (
            Math.abs(x - square.x) < minDistanceX &&
            Math.abs(y - square.y) < minDistanceY
        ) {
            return true;
        }
    }
    return false;
}

function redrawSquares() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw the grid
    drawGrid();

    for (var i = 0; i < squares.length; i++) {
        var square = squares[i];
        drawSquare(square.x, square.y, square.width, square.height, square.color, square.name);
    }
}

function drawGrid() {
    context.beginPath();
    context.strokeStyle = "#ddd";

    // Draw horizontal grid lines
    for (var i = 10; i < canvas.height; i += 10) {
        context.moveTo(0, i);
        context.lineTo(canvas.width, i);
    }

    // Draw vertical grid lines
    for (var j = 10; j < canvas.width; j += 10) {
        context.moveTo(j, 0);
        context.lineTo(j, canvas.height);
    }

    context.stroke();
    context.closePath();
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
// Add event listener for download JSON button click
var downloadJsonBtn = document.getElementById("downloadJsonBtn");
downloadJsonBtn.addEventListener("click", function () {
    downloadJson();
});

// Function to download JSON
function downloadJson() {
    // Convert squares array to JSON string
    var jsonContent = JSON.stringify(squares, null, 2);

    // Create a Blob with the JSON content
    var blob = new Blob([jsonContent], { type: "application/json" });

    // Create a download link
    var downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "canvas_squares.json";

    // Append the link to the document
    document.body.appendChild(downloadLink);

    // Trigger the download
    downloadLink.click();

    // Remove the link from the document
    document.body.removeChild(downloadLink);
}
// Add event listener for upload JSON input change
var uploadJsonInput = document.getElementById("uploadJsonInput");
uploadJsonInput.addEventListener("change", function () {
    uploadJson();
});

// Function to handle file upload
function uploadJson() {
    var fileInput = document.getElementById("uploadJsonInput");
    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var content = e.target.result;
            try {
                var json = JSON.parse(content);

                // Merge the loaded squares with existing squares
                squares = squares.concat(json);

                // Redraw the canvas with the updated squares
                redrawSquares();
                saveSquares();
            } catch (error) {
                alert("Error parsing JSON file. Please make sure the file is valid JSON.");
            }
        };

        reader.readAsText(file);
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