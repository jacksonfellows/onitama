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
            if (game_state.board[row][col] != EMPTY) {
                handle_move_attempt_start(row, col);
                start_row_col = [row, col];
            }
        });
        board_divs[row][col].addEventListener("mouseup", _ => {
            handle_move_attempt_end();
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

function get_color(square_state) {
    console.assert(square_state != EMPTY);
    if (square_state == BP || square_state == BM) return "black";
    return "white";
}

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
    let valid_moves = get_valid_moves(start_row, start_col, "rooster");
    if (valid_moves.map(([row, col]) => row == end_row && col == end_col).reduce((x, y) => x || y)) {
        game_state.board[end_row][end_col] = game_state.board[start_row][start_col];
        game_state.board[start_row][start_col] = EMPTY;
        draw_board(game_state.board);
    }
}

let move_cards = {
    monkey: [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0]
    ],
    dragon: [
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0]
    ],
    rooster: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]
};

let move_cards_offsets = {};
for (let card_name in move_cards) {
    let offsets = [];
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (move_cards[card_name][row][col]) {
                offsets.push([row - 2, col - 2])
            }
        }
    }
    move_cards_offsets[card_name] = offsets;
}

function on_board(row, col) {
    return 0 <= row && row < 5 && 0 <= col && col < 5;
}

function get_valid_moves(row, col, card_name) {
    let color = get_color(game_state.board[row][col])
    let moves = [];
    for (let [drow, dcol] of move_cards_offsets[card_name]) {
        if (color == "black") {
            // Flip moves.
            drow = -drow;
            dcol = -dcol;
        }
        if (on_board(row + drow, col + dcol)) {
            let dst_square = game_state.board[row + drow][col + dcol];
            if (dst_square == EMPTY || get_color(dst_square) != color) {
                moves.push([row + drow, col + dcol]);
            }
        }
    }
    return moves;
}

function handle_move_attempt_start(row, col) {
    let valid_moves = get_valid_moves(row, col, "rooster");
    for (let [move_row, move_col] of valid_moves) {
        board_divs[move_row][move_col].classList.add("valid-move");
    }
}

function handle_move_attempt_end() {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            board_divs[row][col].classList.remove("valid-move");
        }
    }
}
