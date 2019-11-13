import React from 'react';
import { useDrag } from 'react-dnd'
import * as boardActions from '../_store/board/actions';

const Pawn = ({ children, rowIndex, style, cellIndex, data, context, activePlayer }) => {

    //Making the pawn draggable using react hook from library
    const [, drag] = useDrag({
        item: { r: rowIndex, c: cellIndex, d: data, type: 'pawn' },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
                if (item.d === activePlayer)
                    context.props.dispatch(boardActions.setPawn(item, dropResult)) //This sends the action to set the pawn in its new dropped position
            }
        },
    })

    return (
        <div  ref={drag}
              style={{
              width:"50px",
              height:"50px",
              margin:"auto",
              borderRadius:"50px",
              cursor:"pointer",
              position:"relative",
              backgroundColor: style['color'],
              zIndex: 100,
              opacity: style['opacity']}}> 
        </div>)
}

export default Pawn