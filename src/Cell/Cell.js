import React from 'react';
import { useDrop } from 'react-dnd'
import Pawn from '../Pawn/Pawn';
import './Cell.css';

const Cell = ({ children, rowIndex, cellIndex, cellData, cellStyles, activePlayer, board, onMouseOver, onMouseLeave, context }) => {


    //Dnd Hook used to make the cell Droppable, accepts 'pawn' only
    const [, drop] = useDrop({
        accept: 'pawn',
        drop: () => ({ name: 'Cell', rowIndex, cellIndex, cellData }),
    })

    //If cell has data render a pawn for it
    let hasPawn = null
    if (cellData !== "")
        hasPawn = <Pawn
					activePlayer={activePlayer} 
					context={context}
					style={cellStyles[String(rowIndex) + cellIndex]} 
					rowIndex={rowIndex} 
					cellIndex={cellIndex} 
					data={cellData}>{cellData}
				  </Pawn>

    return (
        <div
        	ref = { drop }
			className={'cell'}		
			onMouseOver={onMouseOver}
			onMouseLeave={onMouseLeave}
			style={{ backgroundColor: cellStyles[String(rowIndex) + cellIndex].backgroundColor }} >
			{hasPawn}
		</div>
    )
};

export default (Cell)