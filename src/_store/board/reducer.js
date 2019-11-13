import * as types from './actionTypes';

const initialBoard = [
    ['o', '', 'o', '', 'o', '', 'o', ''],
    ['', 'o', '', 'o', '', 'o', '', 'o'],
    ['o', '', 'o', '', 'o', '', 'o', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', 'x', '', 'x', '', 'x', '', 'x'],
    ['x', '', 'x', '', 'x', '', 'x', ''],
    ['', 'x', '', 'x', '', 'x', '', 'x']
];

const initialState = {
    time: 0,
    board: initialBoard,
    activePlayer: 'x',
    highlightedMoves: [],
    styles: {},
    gameEnd: false,
    moves: 0
}

export default function reduce(state = initialState, action = {}) {
    switch (action.type) {

        case types.NEW_GAME:
            let styles_reset = getCellStyles({
                board: {
                    board: [
                        ['o', '', 'o', '', 'o', '', 'o', ''],
                        ['', 'o', '', 'o', '', 'o', '', 'o'],
                        ['o', '', 'o', '', 'o', '', 'o', ''],
                        ['', '', '', '', '', '', '', ''],
                        ['', '', '', '', '', '', '', ''],
                        ['', 'x', '', 'x', '', 'x', '', 'x'],
                        ['x', '', 'x', '', 'x', '', 'x', ''],
                        ['', 'x', '', 'x', '', 'x', '', 'x']
                    ],
                    activePlayer: 'x',
                    highlightedMoves: [],
                    styles: {},
                    gameEnd: false,
                    moves: 0
                }
            });
            return {
                board: [
                    ['o', '', 'o', '', 'o', '', 'o', ''],
                    ['', 'o', '', 'o', '', 'o', '', 'o'],
                    ['o', '', 'o', '', 'o', '', 'o', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', '', '', '', '', '', '', ''],
                    ['', 'x', '', 'x', '', 'x', '', 'x'],
                    ['x', '', 'x', '', 'x', '', 'x', ''],
                    ['', 'x', '', 'x', '', 'x', '', 'x']
                ],
                activePlayer: 'x',
                highlightedMoves: [],
                styles: styles_reset,
                gameEnd: false,
                moves: 0
            }

        case types.HOVER_CELL:
            let stylesC = { ...state.styles };
            let validMoves = highlightValidMovesForPiece(action.r, action.c, action.data, state.board, state.activePlayer)

            validMoves.forEach(item => {
                stylesC[String(item[0]) + item[1]] = {
                    ...stylesC[String(item[0]) + item[1]],
                    backgroundColor: '#98FB98'
                }
            })

            return {
                ...state,
                highlightedMoves: validMoves,
                styles: stylesC,
            }

        case types.ON_MOUSE_LEAVE:
            let styles_leave = { ...state.styles };
            styles_leave = clearHighlightedCells(state.highlightedMoves, styles_leave, action.data)

            return {
                ...state,
                highlightedMoves: [],
                styles: styles_leave
            }

        case types.STORE_STYLES:
            let styles = getCellStyles({ board: { ...state } });
            return {
                ...state,
                styles: styles,
            }

        case types.PLAY_AI_TURN:

            let active = 'x'
            let new_styles = {}
            let ai_pawns = []
            let pastBoard = action.board
            let gameEnd = state.gameEnd

            //Get all moves for all ai pawns
            pastBoard.forEach((row, rowIndex) => {
                row.forEach((cell, cellIndex) => {
                    let possibleMove = highlightValidMovesForPiece(rowIndex, cellIndex, pastBoard[rowIndex][cellIndex], pastBoard, 'o')
                    if (pastBoard[rowIndex][cellIndex] === 'o' && (possibleMove.length > 0))
                        ai_pawns.push([rowIndex, cellIndex, possibleMove]);
                })
            })

            if (ai_pawns.length === 0)
                gameEnd = true

            //Select random AI pawn
            // TODO - P1 : Killer mode - pick up pawn which will kill max opponent pawns
            let randomSelectedAIPawn = ai_pawns[Math.floor(Math.random() * ai_pawns.length)];

            if (randomSelectedAIPawn !== undefined) {

                //Select random move for the Pawn
                //TODO - P2 : Killer mode - pick move by checking length of element 3 in the array
                let randomSelectedAIMove = randomSelectedAIPawn[2][Math.floor(Math.random() * randomSelectedAIPawn[2].length)]


                //Killing the opponents 
                randomSelectedAIMove[2].forEach((item, index) => {
                    if (index % 2 !== 0) return
                    pastBoard[item][randomSelectedAIMove[2][index + 1]] = ""
                })

                //moving the piece
                pastBoard[randomSelectedAIMove[0]][randomSelectedAIMove[1]] = pastBoard[randomSelectedAIPawn[0]][randomSelectedAIPawn[1]]
                pastBoard[randomSelectedAIPawn[0]][randomSelectedAIPawn[1]] = ""
            } else {
                gameEnd = true
            }

            //Check if human player has any valid moves available, if not game end sequence
            let hasMoveAvailable = []
            pastBoard.forEach((row, rowIndex) => {
                row.forEach((cell, cellIndex) => {
                    let possibleMove = highlightValidMovesForPiece(rowIndex, cellIndex, pastBoard[rowIndex][cellIndex], pastBoard, 'x')
                    if (pastBoard[rowIndex][cellIndex] === 'x' && (possibleMove.length > 0))
                        hasMoveAvailable.push([rowIndex, cellIndex, possibleMove]);
                })
            })

            if (hasMoveAvailable.length === 0)
                gameEnd = true
            let randomSelectedPlayerPawn = hasMoveAvailable[Math.floor(Math.random() * hasMoveAvailable.length)];
            if (randomSelectedPlayerPawn === undefined)
                gameEnd = true

            new_styles = calculateStyles(pastBoard, active)


            return {
                ...state,
                highlightedMoves: [],
                styles: new_styles,
                activePlayer: active,
                gameEnd: gameEnd,
                moves: gameEnd ? state.moves : state.moves + 1
            }

        case types.SET_ITEM:
            let activeNew = state.activePlayer === 'x' ? 'o' : 'x'
            let new_styles_new = {}
            let oldBoard = state.board

            //Check if the dropping destination matches the valid moves for the current dragging cell
            let found = state.highlightedMoves.find((item) => {
                return (item[0] === action.dropResult.rowIndex && item[1] === action.dropResult.cellIndex)
            })

            //If valid drop - delete jumped ai pawns and move piece
            if (state.highlightedMoves !== [] && found !== undefined) {
                found[2].forEach((item, index) => {
                    if (index % 2 !== 0) return
                    oldBoard[item][found[2][index + 1]] = ""
                })
                oldBoard[action.dropResult.rowIndex][action.dropResult.cellIndex] = oldBoard[action.item.r][action.item.c]
                oldBoard[action.item.r][action.item.c] = ""
                new_styles_new = calculateStyles(oldBoard, activeNew)
            } else {
                return {
                    ...state,
                }
            }


            return {
                ...state,
                board: oldBoard,
                highlightedMoves: [],
                styles: new_styles_new,
                activePlayer: activeNew,
                gameEnd: false,
                moves: state.moves + 1
            }

        default:
            return state;
    }

}

/* Internal Functions */

function clearHighlightedCells(highlightedMovesArray, styles, data) {
    highlightedMovesArray.forEach(item => {
        styles[String(item[0]) + item[1]] = {
            ...styles[String(item[0]) + item[1]],
            backgroundColor: getBackgroundColor(item[0], item[1], data)
        }
    });

    return styles
}

function calculateStyles(board, activePlayer) {
    let styles = {}
    board.forEach((row, rowindex) => {
        row.forEach((cell, cellIndex) => {
            let data = board[rowindex][cellIndex]
            let color = getColor(rowindex, cellIndex, data)
            let backgroundColor = getBackgroundColor(rowindex, cellIndex, data)
            let opacity = getOpacity(rowindex, cellIndex, activePlayer, data)
            let cursor = getCursor(rowindex, cellIndex, data)

            styles[String(rowindex) + cellIndex] = {
                color: color,
                backgroundColor: backgroundColor,
                opacity: opacity,
                cursor: cursor
            }

        })
    })
    return styles
}


/* 
Primary function to look for valid cells to move a hovered pawn
r: rowIndex
c: columnIndex
data: actual contents of the cell
board: state of board at that time
activePlayer: shows current active player - informs the direction of play (ex: if AI is active, downward play denoted by "1")

Returns array of possible moves with each element having format : 
1. rowIndex of destination 
2. columnIndex of destination
3. Array of elements to delete if the jump is made [r1, c1, r2, c2, .... , rN, cN]
*/

function highlightValidMovesForPiece(r, c, data, board, activePlayer) {
    let validMoves = [];
    let direction = [];
    let leftAndRight = [1, -1];
    let jumpMoves = []
    let jump = false

    if (activePlayer === 'x')
        direction.push(-1);
    else
        direction.push(1);

    direction.forEach(dir => {
        leftAndRight.forEach(hor => {
            if (isOnBoardAndValid([r + dir, c + hor], board, activePlayer)) {
                if (board[r + dir][c + hor] === '')
                    validMoves.push([r + dir, c + hor, []])
                else if (board[r + dir][c + hor] !== activePlayer) {
                    if (isOnBoardAndValid([r + (2 * dir), c + (2 * hor)], board, activePlayer) && board[r + (2 * dir)][c + (2 * hor)] === '') {
                        validMoves.push([r + (2 * dir), c + (2 * hor), [r + dir, c + hor]])
                        jump = true
                        validMoves.push(...jumpLookup(leftAndRight, [r + dir, c + hor], board, activePlayer, dir, hor, board[r + (2 * dir)][c + (2 * hor)], r + (2 * dir), c + (2 * hor), jumpMoves))
                    }

                }
            }

        })
    })


    //This is to check if a jump is possible from the given pawn cell - if yes remove all non-jump moves 
    if (jump) {
        validMoves = validMoves.filter(function(value, index, arr) {
            return value[2].length > 0;
        });
    }

    return validMoves
}


/*
This is the secondary function to recursively find further jumps once a jump is detected
Return an array with each element of format: 
1. rowIndex of destination of consecutive jumps
2. columnIndex of destination of consecutive jumps
3. Array of elements to delete if the jump is made [r1, c1, r2, c2, .... , rN, cN]
*/
function jumpLookup(leftAndRight, wouldDelete, board, activePlayer, direction, horizontal, odldata, newR, newC, jumping) {
    leftAndRight.forEach(hor => {
        if (isOnBoardAndValid([newR + direction, newC + hor], board, activePlayer)) {
            if (board[newR + direction][newC + hor] !== activePlayer && board[newR + direction][newC + hor] !== "") {
                if (isOnBoardAndValid([newR + (2 * direction), newC + (2 * hor)], board, activePlayer) && board[newR + (2 * direction)][newC + (2 * hor)] === '') {
                    jumping.push([newR + (2 * direction), newC + (2 * hor), [...wouldDelete, newR + direction, newC + hor]])
                    jumping.push(...jumpLookup(leftAndRight, [...wouldDelete, newR + direction, newC + hor], board, activePlayer, direction, horizontal, board[newR + (2 * direction)][newC + (2 * hor)], newR + (2 * direction), newC + (2 * hor), jumping))
                }
            }
        }
    })
    return jumping
}


//Helper function to check if a cell locaiton is valid and part of the board
function isOnBoardAndValid(xy, board, activePlayer) {
    if (xy[0] < board.length && xy[0] > -1 && xy[1] > -1 && xy[1] < board[0].length)
        return true
    return false
}

function getColor(r, c, data) {
    if (data === 'x')
        return 'red';
    if (data === 'o')
        return 'DarkBlue';
    return getBackgroundColor(r, c, data);
}

function getBackgroundColor(r, c, data) {
    return (r + c) % 2 === 1 ? 'white' : '#eee'
}

//If player is not active decreses opactiy of pawn
function getOpacity(r, c, activePlayer, data) {
    if (data === activePlayer)
        return 1
    else
        return 0.3
}

function getCursor(r, c, data) {
    return data !== '' ? 'pointer' : ''
}



/* External Functions */


export function getCellStyles(state) {
    const board = state.board.board;
    const activePlayer = state.board.activePlayer;
    let styles = state.board.styles;
    if (Object.keys(styles).length > 0)
        return styles

    if (board !== undefined && board.length > 0)
        styles = calculateStyles(board, activePlayer)
    return styles;
}

export function getBoardState(state) {
    const board = state.board.board;
    return board;
}


//Once game end is detected  - this function finds the codition for game end based on board state
export function getGameEndStatus(state) {
    let gameEnd = state.board.gameEnd;
    const board = state.board.board;
    if (gameEnd) {
        let hasRed = false
        let hasBlack = false
        board.forEach(row => {
            row.forEach(cell => {
                if (cell === 'x')
                    hasRed = true
                if (cell === 'o')
                    hasBlack = true
            })
        })
        if (hasRed && hasBlack)
            gameEnd = "It's a draw!"
        else if (hasRed && !hasBlack)
            gameEnd = "You Win!"
        else
            gameEnd = 'AI Wins!'
    }
    return gameEnd;
}

export function getActivePlayer(state) {
    const activePlayer = state.board.activePlayer;
    return activePlayer;
}

export function getMoves(state) {
    const moves = state.board.moves;
    return moves;
}

export function getCount(state, data) {
    const board = state.board.board;
    let count = 0
    if (board)
        board.forEach(row => {
            row.forEach(item => {
                if (item === data)
                    count++
            })
        })
    return count;
}