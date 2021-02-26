import React, { useContext, useState } from 'react';
import userAuth from '../Context/userAuth';
import userPic from '../Svg/user.svg';
import rockPic from '../Svg/hand-rock.svg';
import paperPic from '../Svg/hand-paper.svg';
import scissorsPic from '../Svg/hand-scissors.svg';
import './Game.css';

export default function Game (props) { 
    const context = useContext(userAuth);

    const [winner, setWinner] = useState();
    const [u1, setU1] = useState(0);
    const [u2, setU2] = useState(0);

    const handleGameCommand = e => {
        const command = e.target.closest('button').id;
        context.socket.emit('nextMove',
            {
                move: command,
                username: context.user.userName,
                opponent: context.user.opponent,
                roomId: context.user.userCode,
                round: context.user.round
            });
            context.user.setRound(context.user.round+1)
    }

    context.socket.on('winner', data => {
        setWinner(data.winner);
        if (data.winner === context.user.userName) {
            setU1(u1 + 1);
        }
        else setU2(u2 + 1);
    });

    return (
        <div className='game-container'>
            <div className="top d-flex justify-content-center align-items-center">
                <div className="d-flex justify-content-center flex-column ">
                    <div className="player-pic"><img src={userPic} className="rounded-circle p-2" width="64" alt="profile"/></div>
                    <div className="player-info text-center font-weight-bold"><h2>{context.user.opponent}</h2></div>
                </div>
            </div>
            <div className="mid">
                <h3 id='round'>Round: {context.user.round}</h3>
                <h3 id='winner'>Winner: {winner}</h3>
                <h3 id='result'>result: {u1} - {u2}</h3>
            </div>
            <div className="bot">
                <div className="p-5 d-flex justify-content-center">
                    <button id="rock" className="game-button" onClick={handleGameCommand.bind(this)}><img src={rockPic} alt="rock" /></button>
                    <button id="paper" className="game-button" onClick={handleGameCommand.bind(this)}><img src={paperPic} alt="paper"/></button>
                    <button id="scissors" className="game-button" onClick={handleGameCommand.bind(this)}><img src={scissorsPic} alt="scissors"/></button>
                </div>
            </div>
        </div>
    )
}