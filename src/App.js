import React, { useEffect, useRef, useState } from 'react';
import {Route, Switch} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import userAuth from './Context/userAuth';
import Dashboard from './Components/Dashboard';
import SignIn from './Components/SignIn';
import Game from './Components/Game';
import io from 'socket.io-client';

const socket = io('http://localhost:3002');

const App = props => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [sysMsg, setSysMsg] = useState();
    const [userName, setUserName] = useState();
    const [userCode, setUserCode] = useState();
    const [opponent, setOpponent] = useState();
    const [round, setRound] = useState('0');

    useEffect(() => {
        console.log('change: ', userLoggedIn);
        socket.on('gameStarting', data => {
            if ( data.stat === 400) {
                setUserLoggedIn(true);
                setOpponent(data.opponent);
            } else {
                setUserLoggedIn(false);
            }
            setSysMsg(data.systemMassage);
        });
    }, [userLoggedIn]);
    
    const user = {userName: userName, userCode: userCode, opponent: opponent, round: round, setUserName, setUserCode, setUserLoggedIn};
    const value = {socket, user};

    return (
        <Container fluid={true} className="main">
            <h1>Rock Paper Scissors!</h1>
            <userAuth.Provider value={value}>
                {
                    userLoggedIn ? <Game setRound={setRound} /> :  <SignIn setUserCode={setUserCode} setUserName={setUserName} sysMsg={sysMsg}/>
                }
            </userAuth.Provider>
        </Container>
    );
}

export default App;