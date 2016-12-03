var Move = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
}

var MoveToKeyCode = {
    0: 38, // Up
    1: 39, // Right
    2: 40, // Down
    3: 37, // Left
}

/**
 * Execute a move repeatly.
 * The interval is set in GameConfig.
 */
function startGame() {
    setTimeout(function () {
        var grid = getGrid(document);
        getBestMove(grid, function(move){
            moveTo(move);
            startGame();
        });
    }, GameConfig.interval);
}

startGame();

/**
 * Ask to the REST API at http://localhost:3000/next-move
 * which is the best next move and return it
 */
function getBestMove(grid, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/next-move", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            cb(xhr.responseText);
        }
    }
    xhr.send(JSON.stringify(grid));
}

/**
 * Execute the next move in the grid.
 */
function moveTo(move) {
    evt = new KeyboardEvent('keydown', {
        bubbles: true
    })

    // Chromium Hack   
    Object.defineProperty(evt, 'which', {
        get: function () {
            return MoveToKeyCode[move];
        }
    });

    document.body.dispatchEvent(evt);
}

/**
 * Return the grid status as a matrix of integer. 
 */
function getGrid(dom) {
    var grid = [];

    for (var r = 1; r < 5; r++) {
        var row = [];
        for (var c = 1; c < 5; c++) {
            var cell = 0;
            try {
                cell = dom
                    .getElementsByClassName('tile-position-' + c + '-' + r)[0]
                    .getElementsByClassName('tile-inner')[0].innerHTML;
            } catch (e) {
            }

            row.push(parseInt(cell));
        }
        grid.push(row);
    }

    return grid;
}





