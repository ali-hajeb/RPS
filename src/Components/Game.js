import React, { useContext } from 'react';
import userAuth from '../Context/userAuth';
import './Game.css';

export default function Game (props) { 
    const context = useContext(userAuth);

    const handleGameCommand = e => {
        const command = e.target.id;
        context.socket.emit('nextMove',
            {
                move: command,
                username: context.user.userName,
                opponent: context.user.opponent,
                gamenumber: context.user.userCode,
                round: context.user.round
            });
    }
    return (
        <div className='game-container'>
            <div className="top">
                <div className="d-flex">
                    <div className="player-pic"></div>
                    <div className="player-info">{context.user.opponent}</div>
                </div>
            </div>
            <div className="mid">test</div>
            <div className="bot">
                <div className="d-flex flex-column">
                    <div className="d-flex">
                        <button id="rock" className="game-button" onClick={handleGameCommand.bind(this)}>rock</button>
                        <button id="paper" className="game-button" onClick={handleGameCommand.bind(this)}>paper</button>
                        <button id="scissor" className="game-button" onClick={handleGameCommand.bind(this)}>scissor</button>
                    </div>
                    <div className="d-flex">
                        <div className="player-pic"></div>
                        <div className="player-info">{context.user.userName}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}