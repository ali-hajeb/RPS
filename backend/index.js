/* eslint-disable no-undef */
//vali man hamchenan kos mikham
//kir too "Samane" github
//heil
//dooste bi chesm dasht
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
    /*console.log(rooms[0]);
    console.log(socket.roomId);
    rooms.splice(roomFinding(socket.roomNumber), 1);
    //*/
    console.log('user disconnected');
  });

  socket.on('addUser', data => {
    socket.join(data.userName);
    io.to(data.userName).emit('loggedIn');
    console.log("adduser  rooms :"+rooms);

    console.log("adduser:"+data.roomId+" "+data.userName);

    roomNumber = roomProcessing(data.roomId, data.userName);

    if (roomNumber === "full") {
      io.to(data.userName).emit('gameStarting', { stat: 200, systemMassage: "full" });
      console.log("adduser  full :");
    }
    else if (roomNumber === "create") {
      console.log("adduser  create :");

      io.to(data.userName).emit('gameStarting', { stat: 300, yourusername: data.userName, opponent: null, gamenumber: rooms.length - 1, systemMassage: "Wait for User to connect your room id is: " + rooms[rooms.length - 1].roomId });
    }
    else { //join
      console.log("adduser  join :");

      io.to(data.userName).emit('gameStarting', { stat: 400, yourusername: data.userName, opponent: rooms[roomNumber].firstPlayer, gamenumber: roomNumber, systemMassage: "Game Started!" });
      io.to(rooms[roomNumber].firstPlayer).emit('gameStarting', { stat: 400, yourusername: rooms[roomNumber].firstPlayer, opponent: data.userName, gamenumber: roomNumber, systemMassage: "Game Started!" });
    }
    //socket.roomId = roomNumber; 
    //console.log(socket.roomId);
  });  //end of user adding 

  socket.on('nextMove', (move) => {
    console.log(move);

    let currentGameNumber = move.gamenumber;
    //let currentGameNumber = roomFinding(move.roomId);

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
  function roomProcessing(roomId, player) {
    if (typeof roomId === 'undefined') {
      roomNumber = findEmptyRoom();
      if (roomNumber === "none") {
        rooms.push({
          roomId: rooms.length,
          full: false,
          random: true,
          firstPlayer: player,
          secondPlayer: null,
          round: 0,
          moves: []
        });
        return "create";
      }
      else {
        rooms[roomNumber].secondPlayer = player;
        rooms[roomNumber].full = true;
        return roomNumber;
      }
    }//end random
    else {
      let roomNumber = roomFinding(roomId);
      if (roomNumber === "unfound") {
        rooms.push({
          roomId: roomId,
          full: false,
          random: false,
          firstPlayer: player,
          secondPlayer: null,
          round: 0,
          moves: []
        });
        console.log("roomprocessing:" + "none randome create");
        return "create";
      }
      else if (rooms[roomNumber].full) {
        console.log("roomprocessing:" + "none randome full");
        return 'full';
      }
      else {
        rooms[roomNumber].secondPlayer = player;
        rooms[roomNumber].full = true;
        console.log("roomprocessing:" + "none randome"+roomNumber);
        return roomNumber;
      }
    }
  }
  function findEmptyRoom() {
    for (i = 0; i < rooms.length; i++) {
      if (rooms[i].random && !rooms[i].full) {
        console.log("findempty:" + i);
        return i;
      }
    }
    console.log("findempty:" + "none");

    return "none";
  }
  function roomFinding(roomId) {
    for (i = 0; i < rooms.length; i++) {
      if (rooms[i].roomId === roomId) {
        console.log("roomFinding:" + i);
        return i;
      }
      else {
        continue;
      }
    }
    console.log("roomFinding:" + "unfound");
    return "unfound";
  }
});

http.listen(4645, () => {
  console.log('listening on *:4645');
});