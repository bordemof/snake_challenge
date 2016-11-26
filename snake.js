// 1:51:23
var SnakeGame = function(options) {

    var options = {
        dificuty: 'easy',
        background: 'white',
        snakeColor: 'black',
        boardColor: 'thick solid gray',
        boardHeight: 30,
        boardWidth: 30,
        initialPositionX: 0,
        initialPositionY: 0,
        cellColor: 'red',
        snakeDirection: 'down',
        initialInterval: 250,
        foodColor: 'goldenrod'
    }

    var snakeQueue     = []
    var BOARD_MATRIX   = []
    var snakeDirection = options.snakeDirection;
    var currentPositionX = options.initialPositionX;
    var currentPositionY = options.initialPositionY;
    var firstCell = undefined

    _initialize = function (artist) {
        window.onload = function() {
            var gameBoard = document.createElement('div');
            gameBoard.style.border     = options.boardColor;
            gameBoard.style.width      = (options.boardWidth*15)+'px'
            gameBoard.style.height     = (options.boardHeight*15)+'px'
            gameBoard.style.display    = 'inline-block'
            gameBoard.style.lineHeight = 0;
            document.body.appendChild(gameBoard);
            for (var i=0; i<options.boardHeight; i++){
                BOARD_MATRIX.push([])
                for (var j=0; j<options.boardWidth; j++){
                    var cell = document.createElement('div');
                    cell.style.backgroundColor  = options.cellColor;
                    cell.style.height  = '15px'
                    cell.style.width   = '15px'
                    cell.style.display = 'inline-block'
                    cell.style.borderRadius = '5px'
                    BOARD_MATRIX[i][j] = cell
                    gameBoard.appendChild(cell);
                }
            }
            _locateNextFood()

            document.body.onkeydown = function(evt) {
                if (evt.keyCode === 38)      { snakeDirection = 'up' }
                else if(evt.keyCode === 40 ) { snakeDirection = 'down' }
                else if(evt.keyCode === 37 ) { snakeDirection = 'left'}
                else if(evt.keyCode === 39 ) { snakeDirection = 'right'}
            };
        }
    }()

    _start = function() {
        var initialCell = BOARD_MATRIX[options.initialPositionY][options.initialPositionX]
        _changeCellColor(initialCell);

        (function () {
            var interval = options.initialInterval;
            snakeQueue.push(BOARD_MATRIX[options.initialPositionY][options.initialPositionX])

            timer = function() {
                --interval;
                if ( _isNextMovementAllowed() ) {
                    var nextMovement = _calcNextMovement();
                    console.log("Moving to x:" + nextMovement.x + "," + nextMovement.y)
                    var nextCell = BOARD_MATRIX[nextMovement.y][nextMovement.x]

                    if (nextCell.style.backgroundColor != options.foodColor) {
                        _remainSnakeSameSize()
                    } else{
                        _locateNextFood()
                    }
                    _moveSnakeOnePositionForward(nextCell)
                    currentPositionX = nextMovement.x
                    currentPositionY = nextMovement.y
                    setTimeout(timer, interval);
                } else {
                    alert(':::::::: GAME OVER ::::::::')
                    window.location.reload();
                }
            };
            timer();
        })();
    };

    _changeCellColor = function(cell) {
       cell.style.backgroundColor = (cell.style.backgroundColor === options.snakeColor) ? options.cellColor : options.snakeColor
    }

    _calcNextMovement = function() {
        var movement = {x:currentPositionX, y: currentPositionY }
        if (snakeDirection === 'up')        { movement.y = currentPositionY-1 }
        else if (snakeDirection === 'down') { movement.y = currentPositionY+1 }
        else if (snakeDirection === 'right'){ movement.x = currentPositionX+1 }
        else if (snakeDirection === 'left') { movement.x = currentPositionX-1 }
        return movement
    }

    _locateNextFood = function() {
        var randomX = Math.floor((Math.random() * options.boardWidth-1) + 1);
        var randomY = Math.floor((Math.random() * options.boardHeight-1) + 1);
        var firstFood = BOARD_MATRIX[randomY][randomX];
        firstFood.style.backgroundColor = options.foodColor;
    }

    _isNextMovementAllowed = function() {
        var nextMovement = _calcNextMovement();
        // Is inside the MatrixBoard ?
        if (BOARD_MATRIX[nextMovement.y] === undefined || BOARD_MATRIX[nextMovement.y][nextMovement.x] === undefined) { return false }
        // Is that cell already snakeColor painted?
        if (BOARD_MATRIX[nextMovement.y][nextMovement.x].style.backgroundColor === options.snakeColor) { return false }
        return true
    }

    _remainSnakeSameSize = function() {
        var lastCell = snakeQueue.shift();
        _changeCellColor(lastCell);
    }

    _moveSnakeOnePositionForward = function(nextCell) {
        _changeCellColor(nextCell);
        snakeQueue.push(nextCell);
    }

    return {
        start: _start
    }
}()