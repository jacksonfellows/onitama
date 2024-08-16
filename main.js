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
            if (game_state.interactable && game_state.board[row][col] != EMPTY) {
                handle_move_attempt_start(row, col);
                start_row_col = [row, col];
            }
        });
        board_divs[row][col].addEventListener("mouseup", _ => {
            if (game_state.interactable && start_row_col) {
                handle_move_attempt_end();
                [start_row, start_col] = start_row_col;
                if (start_row != row || start_col != col) {
                    handle_move(start_row, start_col, row, col);
                }
                start_row_col = null;
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
    ],
    white_moves: ["rooster", "boar"],
    black_moves: ["tiger", "monkey"],
    current_turn: "white",
    next_white_move: "goose",
    next_black_move: null,
    selected_move: null,
    interactable: true
};

let white_moves_div = document.getElementById("white-moves");
let black_moves_div = document.getElementById("black-moves");
let next_white_move_div = document.getElementById("next-white-move");
let next_black_move_div = document.getElementById("next-black-move");

// TODO better way to do this?
function set_children(div, new_children) {
    while (div.childElementCount > 0) {
        div.removeChild(div.childNodes[0]);
    }
    for (let child of new_children) {
        div.appendChild(child);
    }
}

function draw_game_state() {
    draw_board(game_state.board);

    set_children(white_moves_div, game_state.white_moves.map(card_name => draw_move_card("white", card_name, true)));
    set_children(black_moves_div, game_state.black_moves.map(card_name => draw_move_card("black", card_name, true)));

    if (game_state.next_white_move) {
        set_children(next_white_move_div, [draw_move_card("white", game_state.next_white_move, false)]);
        set_children(next_black_move_div, []);
    } else if (game_state.next_black_move) {
        set_children(next_white_move_div, []);
        set_children(next_black_move_div, [draw_move_card("black", game_state.next_black_move, false)]);
    }
}

function handle_move(start_row, start_col, end_row, end_col) {
    let valid_moves = get_valid_moves(start_row, start_col);
    if (valid_moves.length > 0 && valid_moves.map(([row, col]) => row == end_row && col == end_col).reduce((x, y) => x || y)) {
        // Check for capture of master.
        let capture = game_state.board[end_row][end_col];
        let master_captured = (game_state.current_turn == "white" && capture == BM) || (game_state.current_turn == "black" && capture == WM)

        // Make move.
        game_state.board[end_row][end_col] = game_state.board[start_row][start_col];
        game_state.board[start_row][start_col] = EMPTY;

        // Update cards.
        if (game_state.current_turn == "white") {
            game_state.white_moves = [...game_state.white_moves.filter(m => m != game_state.selected_move), game_state.next_white_move];
            game_state.next_white_move = null;
            game_state.next_black_move = game_state.selected_move;
        } else if (game_state.current_turn == "black") {
            game_state.black_moves = [game_state.next_black_move, ...game_state.black_moves.filter(m => m != game_state.selected_move)];
            game_state.next_black_move = null;
            game_state.next_white_move = game_state.selected_move;
        }
        game_state.selected_move = null;

        draw_game_state();

        let master_in_other_base = game_state.board[0][2] == WM || game_state.board[4][2] == BM;

        if (master_captured || master_in_other_base) {
            window.alert(`${game_state.current_turn} wins!`);
            game_state.interactable = false;
        } else {
            game_state.current_turn = {white: "black", black: "white"}[game_state.current_turn];
        }
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
    tiger: [
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
    ],
    goose: [
        [0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0]
    ],
    boar: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 0, 0, 0],
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

function get_valid_moves(row, col) {
    if (game_state.selected_move) {
        return get_valid_moves_for_card(row, col, game_state.selected_move);
    }
    return [];
}

function get_valid_moves_for_card(row, col, card_name) {
    let color = get_color(game_state.board[row][col])
    let moves = [];
    for (let [drow, dcol] of move_cards_offsets[card_name]) {
        if (color == "black") {
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
    let valid_moves = get_valid_moves(row, col);
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

function handle_move_select(color, card_name, div) {
    if (game_state.interactable && color == game_state.current_turn) {
        game_state.selected_move = card_name;
        let moves_div = {white: white_moves_div, black: black_moves_div}[color];
        for (let div_ of moves_div.childNodes) {
            div_.classList.remove("selected-move");
        }
        div.classList.add("selected-move");
    }
}

function draw_move_card(color, card_name, selectable) {
    let card_div = document.createElement("div");
    card_div.classList.add("move-card");
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            let square_div = document.createElement("div");
            square_div.classList.add("move-card-square");
            if (row == 2 && col == 2) {
                square_div.classList.add("move-card-self");
            }
            let row_ = row;
            let col_ = col;
            if (color == "black") {
                row_ = 2 - (row_ - 2);
                col_ = 2 - (col_ - 2);
            }
            if (move_cards[card_name][row_][col_]) {
                square_div.classList.add("move-card-valid");
            }
            card_div.appendChild(square_div);
        }
    }
    if (selectable) {
        card_div.addEventListener("click", _ => {
            handle_move_select(color, card_name, card_div);
        })
    }
    return card_div;
}

draw_game_state();
