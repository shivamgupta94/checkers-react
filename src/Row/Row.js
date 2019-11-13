import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cell from '../Cell/Cell'
import './Row.css';
import * as boardSelector from '../_store/board/reducer';
import * as boardActions from '../_store/board/actions';

/*
Draws each row for the game board 
*/

class Row extends Component {
    render() {
        const { board, activePlayer, cellStyles, rowIndex } = this.props
        return (
            <div className="row">
				{
					this.props.rowData.map(function(cellData, cellIndex) {
						return (
							<Cell 
								board={board}
								activePlayer={activePlayer}
								cellStyles={cellStyles}
								rowIndex={rowIndex} 
								key={String(rowIndex) + cellIndex} 
								cellIndex={cellIndex} 
								cellData={cellData}

								//For Valid Cell Highlights
								onMouseOver={() => { 
									if(board[rowIndex][cellIndex] === activePlayer)
										this.props.dispatch(boardActions.onHover(rowIndex, cellIndex, board[rowIndex][cellIndex]));
								}}

								//For discarding highlighted cells
								onMouseLeave={() => {
									if(board[rowIndex][cellIndex] === activePlayer)
										this.props.dispatch(boardActions.onMouseLeave(rowIndex, cellIndex, board[rowIndex][cellIndex]));
								}}

								//Pass context for DnD children
								context={this}
								/>
						)
					}, this)
				}
			</div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        board: boardSelector.getBoardState(state),
        activePlayer: boardSelector.getActivePlayer(state),
        cellStyles: boardSelector.getCellStyles(state),
        gameEnd: boardSelector.getGameEndStatus(state)
    };
}

export default connect(mapStateToProps)(Row)