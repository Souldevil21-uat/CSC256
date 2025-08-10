
/* ---------- DOM references ---------- */
const boardEl = document.getElementById("board");
const historyEl = document.getElementById("history");
const turnLabel = document.getElementById("turnLabel");
const resetBtn = document.getElementById("resetBtn");
const advancedToggle = document.getElementById("advancedToggle");

/* ---------- Game constants ---------- */
const SIZE = 8;                  // 8x8 board
const DARK = "dark";             // dark squares (playable)
const LIGHT = "light";           // light squares (non-playable)
const RED = "red";
const BLACK = "black";

/* ---------- Game state ---------- */
// Board is a 2D array of null or { color: "red"|"black", king: boolean }
let board = [];
let turn = RED;                  // Red starts
let selected = null;             // { r, c }
let legalMoves = [];             // Array of { r, c, capture?: { r, c } }
let advanced = false;            // Advanced moves flag

/* ---------- Utility helpers ---------- */

/**
 * Create an empty 8x8 board (all null).
 */
function createEmptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}

/**
 * Initialize pieces on the dark squares:
 * - Black on rows 0..2
 * - Red on rows 5..7
 */
function setupInitialPieces() {
  board = createEmptyBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const isDark = (r + c) % 2 === 1;
      if (!isDark) continue;

      if (r <= 2) {
        board[r][c] = { color: BLACK, king: false };
      } else if (r >= 5) {
        board[r][c] = { color: RED, king: false };
      }
    }
  }
}

/**
 * Convert board coordinates to algebraic-like notation (e.g., A1..H8).
 * Useful for readable history.
 */
function coordLabel(r, c) {
  const file = String.fromCharCode(65 + c);
  const rank = SIZE - r;
  return `${file}${rank}`;
}

/**
 * Check bounds helper.
 */
function inBounds(r, c) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

/* ---------- Move generation ---------- */

/**
 * Get directional deltas for a piece.
 * - Normal red moves "up" (toward r-1), black moves "down" (toward r+1).
 * - Kings can move in both directions.
 */
function moveDeltasFor(piece) {
  if (piece.king) {
    return [-1, 1];
  }
  return piece.color === RED ? [-1] : [1];
}

/**
 * Compute legal one-step moves for the currently selected piece.
 * If advanced mode is on, include jumps (captures) and prefer them
 * (i.e., if any captures exist, only show capture moves).
 */
function computeLegalMoves(r, c) {
  const piece = board[r][c];
  if (!piece) return [];

  const steps = [];
  const jumps = [];
  const rowSteps = moveDeltasFor(piece);

  for (const dr of rowSteps) {
    for (const dc of [-1, 1]) {
      const nr = r + dr;
      const nc = c + dc;

      // One-step diagonal move
      if (inBounds(nr, nc) && board[nr][nc] === null) {
        steps.push({ r: nr, c: nc });
      }

      if (advanced) {
        // Two-step jump if opponent piece in between
        const mr = r + dr;          // middle row
        const mc = c + dc;          // middle col
        const jr = r + 2 * dr;      // landing row
        const jc = c + 2 * dc;      // landing col
        if (
          inBounds(jr, jc) &&
          board[jr][jc] === null &&
          inBounds(mr, mc) &&
          board[mr][mc] &&
          board[mr][mc].color !== piece.color
        ) {
          jumps.push({ r: jr, c: jc, capture: { r: mr, c: mc } });
        }
      }
    }
  }

  // In advanced mode, if any capture is available for this piece, we only allow captures for that piece.
  if (advanced && jumps.length > 0) return jumps;

  // Base (assignment requirement): only one-square moves shown.
  return steps;
}

/**
 * After making a (capture) move in advanced mode, check if same piece can continue jumping.
 */
function computeAdditionalJumps(r, c) {
  const piece = board[r][c];
  if (!piece || !advanced) return [];
  const rowSteps = moveDeltasFor(piece);
  const jumps = [];
  for (const dr of rowSteps) {
    for (const dc of [-1, 1]) {
      const mr = r + dr, mc = c + dc;
      const jr = r + 2 * dr, jc = c + 2 * dc;
      if (
        inBounds(jr, jc) &&
        board[jr][jc] === null &&
        inBounds(mr, mc) &&
        board[mr][mc] &&
        board[mr][mc].color !== piece.color
      ) {
        jumps.push({ r: jr, c: jc, capture: { r: mr, c: mc } });
      }
    }
  }
  return jumps;
}

/* ---------- Rendering ---------- */

/**
 * Render the full board grid and all pieces.
 * Adds data attributes so we can identify squares during clicks.
 */
function renderBoard() {
  boardEl.innerHTML = "";

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const square = document.createElement("div");
      square.className = `square ${(r + c) % 2 === 0 ? "light" : "dark"}`;
      square.setAttribute("role", "gridcell");
      square.dataset.r = r;
      square.dataset.c = c;

      // Hidden coordinate label for screen readers
      const label = document.createElement("span");
      label.className = "coord";
      label.textContent = coordLabel(r, c);
      square.appendChild(label);

      // Render piece if present
      const piece = board[r][c];
      if (piece) {
        const pieceEl = document.createElement("div");
        pieceEl.className = `piece ${piece.color}${piece.king ? " king" : ""}`;
        pieceEl.setAttribute("aria-label", `${piece.king ? "King " : ""}${piece.color} piece at ${coordLabel(r, c)}`);
        square.appendChild(pieceEl);
      }

      boardEl.appendChild(square);
    }
  }

  // Reapply highlights if a piece is selected
  if (selected) {
    const { r, c } = selected;
    const selSq = querySquare(r, c);
    if (selSq) {
      selSq.firstElementChild?.classList.add("selected");
    }
    legalMoves.forEach(m => {
      querySquare(m.r, m.c).classList.add("highlight");
    });
  }
}

/**
 * Helper to get a square element by coordinates.
 */
function querySquare(r, c) {
  return boardEl.querySelector(`.square[data-r="${r}"][data-c="${c}"]`);
}

/* ---------- Interaction logic ---------- */

/**
 * Handle click on a square:
 * - If clicking a highlighted destination, perform the move.
 * - Otherwise, if clicking a piece of the current turn, select it and show its legal moves.
 */
function handleBoardClick(e) {
  const target = e.target.closest(".square");
  if (!target) return;

  const r = Number(target.dataset.r);
  const c = Number(target.dataset.c);

  // If destination is highlighted, execute move
  if (target.classList.contains("highlight")) {
    const move = legalMoves.find(m => m.r === r && m.c === c);
    if (move) {
      makeMove(selected.r, selected.c, move);
    }
    return;
  }

  // Otherwise try selecting a piece
  const piece = board[r][c];
  if (piece && piece.color === turn) {
    selected = { r, c };
    legalMoves = computeLegalMoves(r, c);
  } else {
    // Clicked empty or opponent piece: clear selection
    selected = null;
    legalMoves = [];
  }

  renderBoard();
}

/**
 * Execute a move on the board, with optional capture (advanced mode).
 */
function makeMove(sr, sc, move) {
  const piece = board[sr][sc];
  if (!piece) return;

  // Move the piece
  board[move.r][move.c] = piece;
  board[sr][sc] = null;

  // Handle capture if present (advanced mode)
  let didCapture = false;
  if (move.capture) {
    const { r: mr, c: mc } = move.capture;
    board[mr][mc] = null;
    didCapture = true;
  }

  // King promotion if reaching the far row (only in advanced mode to keep base simple)
  if (advanced) {
    if ((piece.color === RED && move.r === 0) || (piece.color === BLACK && move.r === SIZE - 1)) {
      piece.king = true;
    }
  }

  // Record history (algebraic-ish)
  addHistory(`${capitalize(piece.color)}: ${coordLabel(sr, sc)} → ${coordLabel(move.r, move.c)}${piece.king ? " (K)" : ""}${didCapture ? " ×" : ""}`);

  // Multi-capture: if advanced and we just captured, check for more jumps before switching turns
  if (advanced && didCapture) {
    selected = { r: move.r, c: move.c };
    const moreJumps = computeAdditionalJumps(move.r, move.c);
    if (moreJumps.length > 0) {
      legalMoves = moreJumps;
      renderBoard();
      return; // Same player's turn continues
    }
  }

  // Clear selection and switch turns
  selected = null;
  legalMoves = [];
  turn = turn === RED ? BLACK : RED;
  updateTurnLabel();
  renderBoard();
}

/**
 * Append a line to the move history list.
 */
function addHistory(text) {
  const li = document.createElement("li");
  li.textContent = text;
  historyEl.appendChild(li);
  historyEl.scrollTop = historyEl.scrollHeight;
}

/**
 * Capitalize helper.
 */
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Update the turn text in the UI.
 */
function updateTurnLabel() {
  turnLabel.textContent = capitalize(turn);
}

/**
 * Reset the whole game to initial state.
 */
function resetGame() {
  setupInitialPieces();
  turn = RED;
  selected = null;
  legalMoves = [];
  historyEl.innerHTML = "";
  updateTurnLabel();
  renderBoard();
}

/* ---------- Event bindings ---------- */
boardEl.addEventListener("click", handleBoardClick);
resetBtn.addEventListener("click", resetGame);
advancedToggle.addEventListener("change", (e) => {
  advanced = e.target.checked;
  // Clear any selection to avoid stale highlights
  selected = null;
  legalMoves = [];
  renderBoard();
});

/* ---------- Boot ---------- */
resetGame();
