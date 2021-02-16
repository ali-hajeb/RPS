/* eslint-disable no-undef */
//kir too git
//Man kos mikham
<<<<<<< HEAD
//Catty Coffee ^_^
//Marg bar Shah
//
=======
//na be negahe jensi be dokhtar
>>>>>>> 5794999c29a63c0181f7fc14cb9a99c9dc9a2a73
//from a higher JAYGHAH to the others
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  cors: {
      origin: '*',
    }
  });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

rooms = [];
io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('disconnect', socket => {
    console.log('user disconnected');
    // socket.disconnect();
  });
  
  socket.on('addUser', data => {
    socket.join(data.nickName);
    io.to(data.nickName).emit('loggedIn');
    console.log(data);
    roomNumber = findRoom(data.roomId, rooms, data.nickName);
    if (roomNumber === "full") {
      io.to(data.nickName).emit('gameStarting', { stat: 200, systemMassage: "full" });
    }
    //this fucking number => roomNumber is being sent to clint and is expected to be return in next move
    else if (roomNumber === "create") {
      io.to(data.nickName).emit('gameStarting', { stat: 300, yourusername: data.nickName, opponent: null, gamenumber: rooms.length - 1, systemMassage: "Wait for User to connect your room id is: " + rooms[rooms.length - 1].roomId });
    }
    else { //join
      io.to(data.nickName).emit('gameStarting', { stat: 400, yourusername: data.nickName, opponent: rooms[roomNumber].firstPlayer, gamenumber: roomNumber, systemMassage: "Game Started!" });
      io.to(rooms[roomNumber].firstPlayer).emit('gameStarting', { stat: 400, yourusername: rooms[roomNumber].firstPlayer, opponent: data.nickName, gamenumber: roomNumber, systemMassage: "Game Started!" });
    }
  });  //end of user adding 

  socket.on('nextMove', (move) => {
    console.log(move);
    //this motherfucker code expects a number which refer to the 'rooms[]'
    let currentGameNumber = move.gamenumber;
    if (move.round === String(rooms[currentGameNumber].round)) {
      rooms[currentGameNumber].moves.push({ player: move.username, move: move.move, round: move.round });
      prevMoveIndex = rooms[currentGameNumber].moves.length - 2;
      if (prevMoveIndex >= 0) {
        prevRound = rooms[currentGameNumber].moves[prevMoveIndex].round;
      }
      else {
        prevRound = "undefind";
      }
      if (prevRound === move.round) {
        winner = findTheWinner(rooms[currentGameNumber].moves[prevMoveIndex], rooms[currentGameNumber].moves[prevMoveIndex + 1]);
        let action = "Round:" + move.round + ",Winner is:" + winner + " || " + rooms[currentGameNumber].moves[prevMoveIndex].player + ":" + rooms[currentGameNumber].moves[prevMoveIndex].move + " AND " + rooms[currentGameNumber].moves[prevMoveIndex + 1].player + ":" + rooms[currentGameNumber].moves[prevMoveIndex + 1].move;
        
        io.to(rooms[currentGameNumber].firstPlayer).emit('winner', { winner: winner, round: move.round, action: action });
        io.to(rooms[currentGameNumber].secondPlayer).emit('winner', { winner: winner, round: move.round, action: action });
        rooms[currentGameNumber].round = rooms[currentGameNumber].round + 1;
      }
    }
    else {
    }

  });
  //end of move processign
  function findTheWinner(move1, move2) {
    if (move1.move === move2.move) {
      return 'even';
    }
    if (move1.move === "paper") {
      if (move2.move === "stone") {
        return move1.player;
      }
      else {
        return move2.player;
      }
    }
    if (move1.move === "stone") {
      if (move2.move === "scissores") {
        return move1.player;
      }
      else {
        return move2.player;
      }
    }
    if (move1.move === "scissores") {
      if (move2.move === "paper") {
        return move1.player;
      }
      else {
        return move2.player;
      }
    }
  }
  function findRoom(roomId, rooms, player) {
    for (i = 0; i < rooms.length; i++) {
      if (rooms[i].roomId === roomId) { // found but it may be full
        if (rooms[i].full) {
          return 'full';
        }
        else {
          rooms[i].secondPlayer = player;
          rooms[i].full = true;
          return i;
        }
      }
      else {
        continue;
      }
    }
    rooms.push({ roomId: roomId, full: false, firstPlayer: player, secondPlayer: null, round: 0, moves: [] });
    return "create";
  }
});

http.listen(3002, () => {
  console.log('listening on *:3002');
});