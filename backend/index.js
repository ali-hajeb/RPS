/* eslint-disable no-undef */

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

  socket.on('disconnect', reason => {

    console.log('-------------------------disconnection--------------------------');
    console.log('user disconnected with roomID of' + socket.roomId);

    let roomNum = roomFinding(socket.roomId);

    if (socket.userName === rooms[roomNum].firstPlayer)//room is fucked
    {
      io.to(rooms[roomNum].secondPlayer).emit('disconnection', { stat: "0", message: "move your ass somewhere else bitch" });
      rooms.splice(roomNum, 1);
      console.log("room is fucked. /n" + rooms);

    }
    else { // first player should play with their balls or pussy
      io.to(rooms[roomNum].firstPlayer).emit('disconnection', { stat: "1", message: "your bitch is gone touch yourself for now" });
      let player = rooms[roomNum].firstPlayer;
      rooms[roomNum] = {
        roomId: socket.roomId,
        full: false,
        random: true,
        firstPlayer: player,
        secondPlayer: null,
        round: 0,
        moves: []
      };
      console.log(rooms[roomNum]);
    }


    console.log('user disconnected');
  });

  socket.on('addUser', data => {
    console.log('-------------------------userAdding--------------------------');
    socket.join(data.userName);
    io.to(data.userName).emit('loggedIn');

    roomNumber = roomProcessing(data.roomId, data.userName);
    console.log("roomId:" + data.roomId + " data.username:" + data.userName + " roomnumber:" + roomNumber);

    var n = data.userName.search(/a+l+i/i);

    if (n !== -1) {
      io.to(data.userName).emit('gameStarting', { stat: 200, systemMassage: "We will not play with BI CHESHDASHTS!" });
    }
    else {
      if (roomNumber === "full") {
        io.to(data.userName).emit('gameStarting', { stat: 200, systemMassage: "full" });
        console.log("adduser  full :");
      }
      else if (roomNumber === "create") {
        console.log("adduser  create :");

        io.to(data.userName).emit('gameStarting', { stat: 300, yourusername: data.userName, opponent: null, systemMassage: "Wait for User to connect your room id is: " + rooms[rooms.length - 1].roomId });
      }
      else { //join
        console.log("adduser  join :");

        io.to(data.userName).emit('gameStarting', { stat: 400, yourusername: data.userName, opponent: rooms[roomNumber].firstPlayer, systemMassage: "Game Started!" });
        io.to(rooms[roomNumber].firstPlayer).emit('gameStarting', { stat: 400, yourusername: rooms[roomNumber].firstPlayer, opponent: data.userName, systemMassage: "Game Started!" });
      }
    }
    socket.roomId = data.roomId;
    socket.userName = data.userName;

  });  //end of user adding 

  socket.on('nextMove', (move) => {
    console.log('-------------------------nextMove--------------------------');
    //let currentGameNumber = move.gamenumber;
    let currentGameNumber = roomFinding(move.roomId);
    console.log("currentGameNumber: " + currentGameNumber);

    if (move.round === rooms[currentGameNumber].round) {
      console.log("1");
      rooms[currentGameNumber].moves.push({
        player: move.username,
        move: move.move,
        round: move.round
      });

      prevMoveIndex = rooms[currentGameNumber].moves.length - 2;
      console.log("prevMoveIndex: " + prevMoveIndex);

      if (prevMoveIndex >= 0) {
        prevRound = rooms[currentGameNumber].moves[prevMoveIndex].round;


      }
      else {
        prevRound = "undefind";
      }
      console.log("prevRound: " + prevRound);
      console.log("move.round: " + move.round);

      if (prevRound === move.round) {
        winner = findTheWinner(rooms[currentGameNumber].moves[prevMoveIndex], rooms[currentGameNumber].moves[prevMoveIndex + 1]);
        console.log(winner);
        let action = "Round:" + move.round + ",Winner is:" + winner + " || " + rooms[currentGameNumber].moves[prevMoveIndex].player + ":" + rooms[currentGameNumber].moves[prevMoveIndex].move + " AND " + rooms[currentGameNumber].moves[prevMoveIndex + 1].player + ":" + rooms[currentGameNumber].moves[prevMoveIndex + 1].move;
        io.to(rooms[currentGameNumber].firstPlayer).emit('winner', { stat: 200, winner: winner, round: move.round, action: action });
        io.to(rooms[currentGameNumber].secondPlayer).emit('winner', { stat: 200, winner: winner, round: move.round, action: action });
        rooms[currentGameNumber].round = rooms[currentGameNumber].round + 1;
      }
      else {
        io.to(move.userName).emit('winner', { stat: 400, action: "Your action is not valid " });
      }

    }//

  });
  //end of move processign
  function findTheWinner(move1, move2) {
    console.log("find winners: " + move1.move, move2.move);
    if (move1.move === move2.move) {
      return 'even';
    }
    if (move1.move === "paper") {
      if (move2.move === "rock") {
        return move1.player;
      }
      else {
        return move2.player;
      }
    }
    if (move1.move === "rock") {
      if (move2.move === "scissors") {
        return move1.player;
      }
      else {
        return move2.player;
      }
    }
    if (move1.move === "scissors") {
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
          roomId: roomId,
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
        console.log("roomprocessing:" + "none randome" + roomNumber);
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
        return i;
      }
      else {
        continue;
      }
    }
    return "unfound";
  }
});

http.listen(4645, () => {
  console.log('listening on *:4645');
});