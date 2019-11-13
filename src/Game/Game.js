import React, { Component } from 'react';
import './Game.css';
import Board from "../Board/Board";
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import * as boardSelector from '../_store/board/reducer';
import * as boardActions from '../_store/board/actions';
import HTML5Backend from 'react-dnd-html5-backend';

/* Class to render the game screen along with Stats */
class Game extends Component {

    state = {
        timer: null,
        counter: 0
    };

    componentDidMount() {
        let timer = setInterval(this.tick, 1000);
        this.setState({ timer });
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    componentDidUpdate(nextProps) {

        //On detecting new game start, resetting the timer
        if (nextProps.gameEnd !== this.props.gameEnd) {
            clearInterval(this.state.timer);
            this.setState({ timer: null })
            let timer = setInterval(this.tick, 1000);
            this.setState({ timer });
        }
    }

    //Display seconds as hh:mm 
    /* TODO: range from 00:00 to 59:59 */
    formatSeconds = (sec) => {
        let hrs = Math.floor(sec / 3600);
        let min = Math.floor((sec - (hrs * 3600)) / 60);
        let seconds = sec - (hrs * 3600) - (min * 60);
        seconds = Math.round(seconds * 100) / 100

        let result = (min < 10 ? "0" + min : min);
        result += ":" + (seconds < 10 ? "0" + seconds : seconds);
        return result;
    }

    tick = () => {
        this.setState({
            counter: this.state.counter + 1
        });
    }

    render() {
        let gameEndStatus = "Checkers-React"

        //If game ends stop timer and display the result
        if (this.props.gameEnd) {
            gameEndStatus = this.props.gameEnd
            clearInterval(this.state.timer)
        }

        return (
            <div className="Game">
		        <header className="Game-header">

		        	{/* A Drag and Drop Library Provider 
						TODO: Increase from Web to Touch screens
		        	*/}
			        <DndProvider backend={HTML5Backend}> 
			          	<div className={"Stats"}>
			          		<h1>{gameEndStatus}</h1>
			          		<div className={"Info"}>{"Moves played : " + this.props.moves}</div>
			          		<div style={{float: 'left'}}>
			          			<div className={"Info"}>{"Timer : " + this.formatSeconds(this.state.counter)}</div>
			          		</div>
			          		<div style={{float: 'right'}}>
			          			<button className={"NewGameButton"} onClick={() => {
			          				this.setState({timer: null, counter: 0});
			          				this.props.dispatch(boardActions.resetGame()) }}>New Game</button>
			          		</div>
			          	</div>

			            <Board />
			            
			            <div className={"Stats"}>
			          		<div style={{float: 'left'}}>
			          			<div className={"Info"}>{"AI Pawns : " + this.props.aiPawnCount}</div>
			          		</div>
			          		<div style={{float: 'right'}}>
			          			<div className={"Info"}>{"Your Pawns : "  + this.props.yourPawnCount}</div>
			          		</div>
			          		<a rel="noopener noreferrer" href = "https://github.com/shivamgupta94/checkers-react" target="_blank" className="NewGameButton">{" View on Github"}</a>

			          	</div>
			        </DndProvider>
		        </header>
		    </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        board: boardSelector.getBoardState(state),
        activePlayer: boardSelector.getActivePlayer(state),
        gameEnd: boardSelector.getGameEndStatus(state),
        aiPawnCount: boardSelector.getCount(state, 'o'),
        yourPawnCount: boardSelector.getCount(state, 'x'),
        moves: boardSelector.getMoves(state),
    };
}

export default connect(mapStateToProps)(Game);