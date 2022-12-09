const Authentication = require("./Authentication")
const Asta = require("./Asta");

const auth = new Authentication();
const asta = new Asta()

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on("check-auth", (userToken) => {
      auth.checkAuth(this.io.sockets, this.socket, userToken)
    });

    socket.on("get-active-users", () => {
      auth.sendActiveUsers(this.io.sockets)
    });
    
    socket.on('get-asta-status', () => {
      asta.getAstaStatus(this.io.sockets)
    });

    socket.on("get-soccer-player-status", () => {
      asta.getSoccerPlayerStatus(this.io.sockets)
    });

    socket.on("active-asta", () => {
      asta.activeAsta(this.io.sockets)
    });

    socket.on("select-giocatore", (giocatoreId) => {
      asta.selectGiocatore(this.io.sockets, giocatoreId)
    })

    socket.on("leave-giocatore",() => {
      const user = auth.getUser(this.socket.id)
      asta.leaveGiocatore(this.io.sockets, user)
    })

    socket.on("add-proposta", (value) => {
      const user = auth.getUser(this.socket.id)
      asta.addProposta(this.io.sockets, user, value)
    })

    socket.on('disconnect', () => this.disconnect());
  }

  disconnect() {
    auth.removeUser(this.io.sockets, this.socket.id)
  }
}

function connection(io) {
  io.on('connection', (socket) => {
    new Connection(io, socket);
  });
};

module.exports = connection;