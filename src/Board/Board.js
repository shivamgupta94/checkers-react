import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Board.css';
import Row from '../Row/Row';
import * as boardActions from '../_store/board/actions';
import * as boardSelector from '../_store/board/reducer';

class Board extends Component {

    componentDidMount() {
        this.props.dispatch(boardActions.storeStyles());
    }

    render() {

        //If its AI's turn - play it.
        // TODO: Add AI levels
        if (this.props.activePlayer === 'o')
            this.props.dispatch(boardActions.ai(this.props.board))

        return (
            <div className="board-box">
   				<div className={"board"}>
	        		{this.props.board.map((rowData, rowIndex) => <Row key={rowIndex} rowIndex={rowIndex} rowData={rowData}/>)}
        		</div>
        	</div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        board: boardSelector.getBoardState(state),
        activePlayer: boardSelector.getActivePlayer(state),
        gameEnd: boardSelector.getGameEndStatus(state)
    };
}

export default connect(mapStateToProps)(Board)