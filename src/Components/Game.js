import React, { useContext } from 'react';
import userAuth from '../Context/userAuth';
import userPic from '../Svg/user.svg';
import rockPic from '../Svg/hand-rock.svg';
import paperPic from '../Svg/hand-paper.svg';
import scissorsPic from '../Svg/hand-scissors.svg';
import './Game.css';

export default function Game (props) { 
    const context = useContext(userAuth);

    const handleGameCommand = e => {
        const command = e.target.closest('button').id;
        console.log(command);
        context.socket.emit('nextMove',
            {
                move: command,
                username: context.user.userName,
                opponent: context.user.opponent,
                gamenumber: context.user.gameNumber,
                round: context.user.round
            });
            context.user.setRound(context.user.round+1)
    }

    const handleWinner = e => {
        let winner;
        context.socket.on('winner', data => {
            winner = data.winner;
        });
        return winner;
    }
    return (
        <div className='game-container'>
            <div className="top d-flex justify-content-center align-items-center">
                <div className="d-flex justify-content-center flex-column ">
                    <div className="player-pic"><img src={userPic} className="rounded-circle p-2" width="64" alt="profile"/></div>
                    <div className="player-info text-center font-weight-bold"><h2>{context.user.opponent}</h2></div>
                </div>
            </div>
            <div className="mid">
                <h3>Round: {context.user.round}</h3>
                <h3>Winner: {handleWinner()}</h3>
            </div>
            <div className="bot">
                <div className="p-5 d-flex justify-content-center">
                    <button id="rock" className="game-button" onClick={handleGameCommand.bind(this)}><img src={rockPic} alt="rock" /></button>
                    <button id="paper" className="game-button" onClick={handleGameCommand.bind(this)}><img src={paperPic} alt="paper"/></button>
                    <button id="scissors" className="game-button" onClick={handleGameCommand.bind(this)}><img src={scissorsPic} alt="scissors"/></button>
                    {/* <div className="d-flex">
                        <div className="player-pic"></div>
                        <div className="player-info">{context.user.userName}</div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}