import * as types from './actionTypes';


export function onHover(r, c, data) {
    return (dispatch => {
        dispatch({ type: types.HOVER_CELL, r, c, data });
    });
}

export function onMouseLeave(r, c, data) {
    return (dispatch => {
        dispatch({ type: types.ON_MOUSE_LEAVE, r, c, data });
    });
}

export function ai(board) {
    return (dispatch => {
        dispatch({ type: types.PLAY_AI_TURN, board });
    });
}

export function setPawn(item, dropResult) {
    return (dispatch => {
        dispatch({ type: types.SET_ITEM, item, dropResult });
    });
}

export function resetGame() {
    return (dispatch => {
        dispatch({ type: types.STORE_STYLES });
        dispatch({ type: types.NEW_GAME });

    });
}

export function storeStyles(board, player) {
    return (dispatch => {
        dispatch({ type: types.STORE_STYLES });
    });
}