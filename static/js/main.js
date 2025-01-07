    // Define ideal tile color values (RGB format) for 4 rows, 10 tiles per row
    const idealColors = [
        // Row 0
        { id: "row-0-tile-0", color: "rgb(178, 118, 11)", type: "fixed" },
        { id: "row-0-tile-1", color: "rgb(175, 120, 17)", type: "sortable" },
        { id: "row-0-tile-2", color: "rgb(173, 123, 24)", type: "sortable" },
        { id: "row-0-tile-3", color: "rgb(171, 126, 31)", type: "sortable" },
        { id: "row-0-tile-4", color: "rgb(168, 128, 38)", type: "sortable" },
        { id: "row-0-tile-5", color: "rgb(166, 131, 44)", type: "sortable" },
        { id: "row-0-tile-6", color: "rgb(164, 134, 51)", type: "sortable" },
        { id: "row-0-tile-7", color: "rgb(161, 136, 58)", type: "sortable" },
        { id: "row-0-tile-8", color: "rgb(159, 139, 65)", type: "sortable" },
        { id: "row-0-tile-9", color: "rgb(157, 142, 72)", type: "fixed" },

        // Row 1
        { id: "row-1-tile-0", color: "rgb(151, 145, 75)", type: "fixed" },
        { id: "row-1-tile-1", color: "rgb(143, 145, 81)", type: "sortable" },
        { id: "row-1-tile-2", color: "rgb(135, 146, 88)", type: "sortable" },
        { id: "row-1-tile-3", color: "rgb(128, 146, 95)", type: "sortable" },
        { id: "row-1-tile-4", color: "rgb(120, 147, 101)", type: "sortable" },
        { id: "row-1-tile-5", color: "rgb(112, 147, 108)", type: "sortable" },
        { id: "row-1-tile-6", color: "rgb(105, 148, 115)", type: "sortable" },
        { id: "row-1-tile-7", color: "rgb(97, 148, 121)", type: "sortable" },
        { id: "row-1-tile-8", color: "rgb(89, 149, 128)", type: "sortable" },
        { id: "row-1-tile-9", color: "rgb(82, 150, 135)", type: "fixed" },

        // Row 2
        { id: "row-2-tile-0", color: "rgb(78, 150, 137)", type: "fixed" },
        { id: "row-2-tile-1", color: "rgb(83, 148, 139)", type: "sortable" },
        { id: "row-2-tile-2", color: "rgb(88, 146, 142)", type: "sortable" },
        { id: "row-2-tile-3", color: "rgb(93, 144, 145)", type: "sortable" },
        { id: "row-2-tile-4", color: "rgb(98, 142, 148)", type: "sortable" },
        { id: "row-2-tile-5", color: "rgb(103, 140, 151)", type: "sortable" },
        { id: "row-2-tile-6", color: "rgb(108, 138, 154)", type: "sortable" },
        { id: "row-2-tile-7", color: "rgb(113, 136, 157)", type: "sortable" },
        { id: "row-2-tile-8", color: "rgb(118, 134, 160)", type: "sortable" },
        { id: "row-2-tile-9", color: "rgb(123, 132, 163)", type: "fixed" },

        // Row 3
        { id: "row-3-tile-0", color: "rgb(132, 132, 163)", type: "fixed" },
        { id: "row-3-tile-1", color: "rgb(137, 130, 157)", type: "sortable" },
        { id: "row-3-tile-2", color: "rgb(142, 128, 152)", type: "sortable" },
        { id: "row-3-tile-3", color: "rgb(147, 127, 147)", type: "sortable" },
        { id: "row-3-tile-4", color: "rgb(152, 125, 141)", type: "sortable" },
        { id: "row-3-tile-5", color: "rgb(158, 124, 136)", type: "sortable" },
        { id: "row-3-tile-6", color: "rgb(163, 122, 131)", type: "sortable" },
        { id: "row-3-tile-7", color: "rgb(168, 121, 125)", type: "sortable" },
        { id: "row-3-tile-8", color: "rgb(173, 119, 120)", type: "sortable" },
        { id: "row-3-tile-9", color: "rgb(179, 118, 115)", type: "fixed" }
    ];

document.addEventListener('DOMContentLoaded', () => {
    const testArea = document.getElementById('test-area');

    // Helper function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Group tiles by rows
    const rows = {};
    idealColors.forEach(tile => {
        const rowId = tile.id.split('-')[1]; // Extract row number
        if (!rows[rowId]) {
            rows[rowId] = [];
        }
        rows[rowId].push(tile);
    });

    // Render tiles
    Object.keys(rows).forEach(rowId => {
        const rowTiles = rows[rowId];
        const sortableTiles = rowTiles.filter(tile => tile.type === "sortable");
        const fixedTiles = rowTiles.filter(tile => tile.type === "fixed");

        // Shuffle sortable tiles
        const shuffledSortableTiles = shuffleArray([...sortableTiles]);

        // Merge fixed and shuffled tiles in the correct positions
        const finalRow = [
            fixedTiles.find(tile => tile.id.endsWith('tile-0')), // Start fixed tile
            ...shuffledSortableTiles, // Shuffled sortable tiles
            fixedTiles.find(tile => tile.id.endsWith('tile-9')) // End fixed tile
        ];

        // Create a row in the DOM
        const row = document.createElement('div');
        row.id = `row-${rowId}`;
        row.className = 'row';
        testArea.appendChild(row);

        // Append tiles to the row
        finalRow.forEach(tile => {
            const div = document.createElement('div');
            div.className = 'tile';
            div.style.backgroundColor = tile.color;
            div.setAttribute('data-id', tile.id);
            div.setAttribute('data-type', tile.type);

            if (tile.type === "sortable") {
                div.setAttribute('draggable', 'true');
                div.addEventListener('dragstart', dragStart);
                div.addEventListener('dragover', dragOver);
                div.addEventListener('drop', drop);
            } else {
                div.classList.add('fixed');
            }

            row.appendChild(div);
        });
    });

    // Submit the sorted order
    document.getElementById('submit').addEventListener('click', () => {
        const tiles = document.querySelectorAll('.tile');
        const userOrder = Array.from(tiles).map(tile => ({
            id: tile.getAttribute('data-id'),
            color: tile.style.backgroundColor
        }));

        // Calculate color discrepancies
        const discrepancies = calculateDiscrepancies(userOrder, idealColors);

        console.log("User Order:", userOrder);
        console.log("Discrepancies:", discrepancies);

        // Show the result in a polar chart
        showPolarChart(discrepancies);

        // Submit results to the backend
        fetch('/submit-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: 'user12345', // Replace with a dynamic user ID if available
                responses: discrepancies
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                console.log("Discrepancy Type:", data.discrepancy_type);
                document.getElementById('result').textContent = `Detected: ${data.discrepancy_type}`;
            })
            .catch(err => console.error('Error submitting results:', err));
    });

});


let draggedTile = null;

function dragStart(event) {
    draggedTile = event.target;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const targetTile = event.target;

    if (targetTile.classList.contains('tile') && targetTile.dataset.type === 'sortable') {
        const parent = targetTile.parentNode;
        parent.insertBefore(draggedTile, targetTile.nextSibling);
    }
}

function calculateDiscrepancies(userOrder, idealColors) {
    return userOrder.map((userTile, index) => {
        const idealTile = idealColors[index];
        const userColor = extractRGB(userTile.color);
        const idealColor = extractRGB(idealTile.color);

        // Calculate Euclidean distance in RGB space
        const discrepancy = Math.sqrt(
            Math.pow(userColor.r - idealColor.r, 2) +
            Math.pow(userColor.g - idealColor.g, 2) +
            Math.pow(userColor.b - idealColor.b, 2)
        );

        // Classify the discrepancy type
        const discrepancyType = classifyColorType(idealColor);

        return {
            id: userTile.id,
            discrepancy,
            type: discrepancyType
        };
    });
}

function classifyColorType(color) {
    console.log("Classifying Color:", color);
    if (color.r > color.g && color.r > color.b) {
        return "red";
    } else if (color.g > color.r && color.g > color.b) {
        return "green";
    } else {
        return "neutral";
    }
}
/*
function classifyDiscrepancy(discrepancies) {
    let redDiscrepancy = 0;
    let greenDiscrepancy = 0;

    discrepancies.forEach(d => {
        if (d.type === "red") {
            redDiscrepancy += d.discrepancy;
        } else if (d.type === "green") {
            greenDiscrepancy += d.discrepancy;
        }
    });

    if (redDiscrepancy > greenDiscrepancy) {
        return "Protanopia (difficulty distinguishing reds)";
    } else if (greenDiscrepancy > redDiscrepancy) {
        return "Deuteranopia (difficulty distinguishing greens)";
    } else {
        return "No significant color deficiency detected";
    }
}
*/


// Extract RGB values from a color string like "rgb(255, 0, 0)"
function extractRGB(color) {
    const rgb = color.match(/\d+/g).map(Number);
    return { r: rgb[0], g: rgb[1], b: rgb[2] };
}

function showPolarChart(discrepancies) {
    const ctx = document.getElementById('polarChart').getContext('2d');

    const redData = discrepancies.filter(d => d.type === "red").map(d => d.discrepancy);
    const greenData = discrepancies.filter(d => d.type === "green").map(d => d.discrepancy);
    const neutralData = discrepancies.filter(d => d.type === "neutral").map(d => d.discrepancy);

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: discrepancies.map(d => d.id),
            datasets: [
                {
                    label: 'Red Discrepancy',
                    data: redData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)'
                },
                {
                    label: 'Green Discrepancy',
                    data: greenData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                },
                {
                    label: 'Neutral Discrepancy',
                    data: neutralData,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Color Discrepancy Profile' }
            },
            scales: { r: { beginAtZero: true } }
        }
    });
}




    




    
