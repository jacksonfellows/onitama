// Get div for each square.
let board_divs = [];
for (let row = 0; row < 5; row++) {
    board_divs[row] = [];
    for (let col = 0; col < 5; col++) {
        board_divs[row].push(document.getElementById(`${row+1}${col+1}`))
    }
}

// Set up event handling for squares.
let start_row_col = null;
for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
        board_divs[row][col].addEventListener("mousedown", _ => {
            start_row_col = [row, col];
        });
        board_divs[row][col].addEventListener("mouseup", _ => {
            [start_row, start_col] = start_row_col;
            if (start_row != row || start_col != col) {
                handle_move(start_row, start_col, row, col);
            }
        });
    }
}

// Represent board.
const EMPTY = -1;
const BP    = 0;                   // black pawn
const BM    = 1;                   // black master
const WP    = 2;                   // white pawn
const WM    = 3;                   // white master

let css_class_lookup = {
    [BP]: "black_pawn",
    [BM]: "black_master",
    [WP]: "white_pawn",
    [WM]: "white_master"
};

function draw_board(board) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            board_divs[row][col].className = "square";
            if (board[row][col] != EMPTY) {
                board_divs[row][col].classList.add(css_class_lookup[board[row][col]])
            }
        }
    }
}

let game_state = {
    board: [
        [BP, BP, BM, BP, BP],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
        [WP, WP, WM, WP, WP]
    ]
};

draw_board(game_state.board);

function handle_move(start_row, start_col, end_row, end_col) {
    game_state.board[end_row][end_col] = game_state.board[start_row][start_col];
    game_state.board[start_row][start_col] = EMPTY;
    draw_board(game_state.board);
}
