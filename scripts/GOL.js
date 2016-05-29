//Rules of the game
//if the amount of neighbors is less than 2 or more than 3 the cell dies 
//else the cell stays alive to the next generation.
//If the cell already is dead it can be born if it has 3 neighbors

//State of cell
var isAlive = 1;
var isDead = 2;

//Game object
function GameOfLife() {
    //Create board and a array of cells
    this.board = document.getElementById("board");
    this.ctx = this.board.getContext("2d");
    this.cells = new Array(100);

    //handling of speed and pattern controllers 
    this.amountOfCells = document.getElementById('amountOfCells');
    this.btnFaster = document.getElementById('btnFaster');
    this.btnSlower = document.getElementById('btnSlower');
    this.btnPattern = document.getElementsByClassName('btnPattern');
    this.speed = 1000;
    this.intervalId = false;
    this.addEventListeners();

    //setup board
    this.setup("Random");
    this.setIntervalSpeed(this.speed);
    this.step();
    this.draw();
}

//init eventListeners
GameOfLife.prototype.addEventListeners = function () {
    var self = this;
    //controller to increase speed
    this.btnFaster.addEventListener('click', function () {
        self.speed -= 250;
        self.setIntervalSpeed(self.speed);
    });

    //controller to decrease speed
    this.btnSlower.addEventListener('click', function () {
        self.speed += 250;
        self.setIntervalSpeed(self.speed);
    });

    //constroller to chose pattern
    for (var i = 0; i < this.btnPattern.length; i++) {
        this.btnPattern[i].addEventListener('click', function () {
            var pattern = this.innerHTML;
            self.ctx.clearRect(0, 0, 1000, 1000);
            self.setup(pattern);
            self.draw();
        });
    }
}

//handling new speedInterval
GameOfLife.prototype.setIntervalSpeed = function (speed) {
    var self = this;
    if (this.intervalId) clearInterval(this.intervalId);
    if (speed < 50) speed = 50;
    if (speed > 4000) speed = 4000;

    this.intervalId = setInterval(function () {
        self.step();
        self.draw();
    }, speed);
}

//setup of board
GameOfLife.prototype.setup = function (pattern) {
    //sets up 100 columns for each row
    for (var row = 0; row < this.cells.length; row++) {
        this.cells[row] = new Array(100);
    }
    //all cells will be set to dead as default
    for (var row = 0; row < this.cells.length; row++) {
        for (var column = 0; column < this.cells[row].length; column++) {
            this.cells[row][column] = isDead;
        }
    }

    //choses a pattern from pattern controllers
    //Random pattern as default
    switch (pattern) {

        //Randomly places 1000 live cells over the board
        case "Random":
            var amount = parseInt(this.amountOfCells.value);
            if (isNaN(amount)) amount = 1000;
            for (var i = 0; i < amount; i++) {
                var rndNum1 = Math.round(Math.random() * 99);
                var rndNum2 = Math.round(Math.random() * 99);
                this.cells[rndNum1][rndNum2] = isAlive;
            }
            break;

        //pattern that shots out gliders
        case "Gunner":
            this.gunner();
            break;

        //8 patterns of pulsars at diffrent positions 
        case "Pulsars":
            this.pulsar(1, 1);
            this.pulsar(1, 80);
            this.pulsar(1, 40);
            this.pulsar(20, 20);
            this.pulsar(20, 60);
            this.pulsar(40, 1);
            this.pulsar(40, 40);
            this.pulsar(40, 80);
            this.pulsar(60, 20);
            this.pulsar(60, 60);
            this.pulsar(80, 1);
            this.pulsar(80, 40);
            this.pulsar(80, 80);
            break;
    }
}

//step through the game
GameOfLife.prototype.step = function () {
    //result of the new board
    var result = new Array(100);
    for (var row = 0; row < result.length; row++) {
        result[row] = new Array(100);
    }
    for (var row = 0; row < this.cells.length; row++) {
        for (var column = 0; column < this.cells[row].length; column++) {

            //the sum of neighbors of a cell
            var neighbors = this.countNeighbors(row, column);

            //rules check
            var state;
            if (this.cells[row][column] === isAlive) {
                if (neighbors === 2 || neighbors === 3) {
                    //lives on to the next generation
                    state = isAlive;
                } else {
                    //dies bacause of under or over population
                    state = isDead;
                }
            } else {
                //new born
                if (neighbors === 3) {
                    state = isAlive;
                } else {
                    state = isDead;
                }
            }
            //sets cell's new state 
            result[row][column] = state;
        }
    }
    //replaces the old with new cells
    this.cells = result;
}

//checks if the position of a cell is inside the board
GameOfLife.prototype.isInsideBoard = function isInsideBoard(y, x) {
    return this.cells[y] && this.cells[y][x] && this.cells[y][x] === isAlive;
}

//counting and return the amount of neighbors 
GameOfLife.prototype.countNeighbors = function (row, column) {
    var count = 0;

    //checks if the cell is inside the board and
    //looking for neighbors in 8 directions
    if (this.isInsideBoard(row - 1, column - 1)) count++;
    if (this.isInsideBoard(row - 1, column)) count++;
    if (this.isInsideBoard(row - 1, column + 1)) count++;
    if (this.isInsideBoard(row, column - 1)) count++;
    if (this.isInsideBoard(row, column + 1)) count++;
    if (this.isInsideBoard(row + 1, column - 1)) count++;
    if (this.isInsideBoard(row + 1, column)) count++;
    if (this.isInsideBoard(row + 1, column + 1)) count++;

    return count;
}

//draw the board
GameOfLife.prototype.draw = function () {
    this.ctx.clearRect(0, 0, 1000, 1000);
    for (var row = 0; row < this.cells.length; row++) {
        for (var column = 0; column < this.cells[row].length; column++) {
            this.ctx.fillStyle = this.cells[row][column] === isAlive ? "#fff" : '#242323';
            this.ctx.fillRect(column * 10, row * 10, 10, 10);
        }
    }
}

//pattern of gunner
GameOfLife.prototype.gunner = function () {
    this.cells[6][2] = isAlive; this.cells[7][2] = isAlive; this.cells[6][3] = isAlive;
    this.cells[7][3] = isAlive;

    this.cells[6][12] = isAlive; this.cells[7][12] = isAlive; this.cells[8][12] = isAlive;
    this.cells[5][13] = isAlive; this.cells[9][13] = isAlive; this.cells[4][14] = isAlive;
    this.cells[10][14] = isAlive; this.cells[4][15] = isAlive; this.cells[10][15] = isAlive;
    this.cells[7][16] = isAlive; this.cells[5][17] = isAlive; this.cells[9][17] = isAlive;
    this.cells[6][18] = isAlive; this.cells[7][18] = isAlive; this.cells[8][18] = isAlive;
    this.cells[7][19] = isAlive;

    this.cells[4][22] = isAlive; this.cells[5][22] = isAlive; this.cells[6][22] = isAlive;
    this.cells[4][23] = isAlive; this.cells[5][23] = isAlive; this.cells[6][23] = isAlive;
    this.cells[3][24] = isAlive; this.cells[7][24] = isAlive; this.cells[2][26] = isAlive;
    this.cells[3][26] = isAlive; this.cells[7][26] = isAlive; this.cells[8][26] = isAlive;

    this.cells[4][36] = isAlive; this.cells[5][36] = isAlive; this.cells[4][37] = isAlive;
    this.cells[5][37] = isAlive;
}

//pattern of one pulsar
GameOfLife.prototype.pulsar = function (x, y) {
    this.cells[x + 6][y + 2] = isAlive; this.cells[x + 12][y + 2] = isAlive; this.cells[x + 6][y + 3] = isAlive;
    this.cells[x + 12][y + 3] = isAlive; this.cells[x + 6][y + 4] = isAlive; this.cells[x + 7][y + 4] = isAlive;
    this.cells[x + 11][y + 4] = isAlive; this.cells[x + 12][y + 4] = isAlive;

    this.cells[x + 2][y + 6] = isAlive; this.cells[x + 3][y + 6] = isAlive; this.cells[x + 4][y + 6] = isAlive;
    this.cells[x + 7][y + 6] = isAlive; this.cells[x + 8][y + 6] = isAlive; this.cells[x + 10][y + 6] = isAlive;
    this.cells[x + 11][y + 6] = isAlive; this.cells[x + 14][y + 6] = isAlive; this.cells[x + 15][y + 6] = isAlive;
    this.cells[x + 16][y + 6] = isAlive;

    this.cells[x + 4][y + 7] = isAlive; this.cells[x + 6][y + 7] = isAlive; this.cells[x + 8][y + 7] = isAlive;
    this.cells[x + 10][y + 7] = isAlive; this.cells[x + 12][y + 7] = isAlive; this.cells[x + 14][y + 7] = isAlive;

    this.cells[x + 6][y + 8] = isAlive; this.cells[x + 7][y + 8] = isAlive; this.cells[x + 11][y + 8] = isAlive;
    this.cells[x + 12][y + 8] = isAlive;

    this.cells[x + 6][y + 10] = isAlive; this.cells[x + 7][y + 10] = isAlive; this.cells[x + 11][y + 10] = isAlive;
    this.cells[x + 12][y + 10] = isAlive;

    this.cells[x + 4][y + 11] = isAlive; this.cells[x + 6][y + 11] = isAlive; this.cells[x + 8][y + 11] = isAlive;
    this.cells[x + 10][y + 11] = isAlive; this.cells[x + 12][y + 11] = isAlive; this.cells[x + 14][y + 11] = isAlive;

    this.cells[x + 2][y + 12] = isAlive; this.cells[x + 3][y + 12] = isAlive; this.cells[x + 4][y + 12] = isAlive;
    this.cells[x + 7][y + 12] = isAlive; this.cells[x + 8][y + 12] = isAlive; this.cells[x + 10][y + 12] = isAlive;
    this.cells[x + 11][y + 12] = isAlive; this.cells[x + 14][y + 12] = isAlive; this.cells[x + 15][y + 12] = isAlive;
    this.cells[x + 16][y + 12] = isAlive;

    this.cells[x + 6][y + 16] = isAlive; this.cells[x + 12][y + 16] = isAlive; this.cells[x + 6][y + 15] = isAlive;
    this.cells[x + 12][y + 15] = isAlive; this.cells[x + 6][y + 14] = isAlive; this.cells[x + 7][y + 14] = isAlive;
    this.cells[x + 11][y + 14] = isAlive; this.cells[x + 12][y + 14] = isAlive;
}


//Let the game begin!
var gol = new GameOfLife();