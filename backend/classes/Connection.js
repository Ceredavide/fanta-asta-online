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

    socket.on("active-asta", () => {
      asta.activeAsta(this.io.sockets)
    });

    socket.on("select-giocatore", (giocatore) => {
      asta.selectGiocatore(this.io.sockets, giocatore)
    })

    socket.on("send-proposta", (value) => {
      const user = auth.getUser(this.socket.id)
      asta.sendProposta(this.io.sockets, user, value)
    })

    socket.on('disconnect', () => this.disconnect());
    //   socket.on('connect_error', (err) => {
    //     console.log(`connect_error due to ${err.message}`);
    //   });
  }

  disconnect() {
    auth.removeUser(this.io.sockets, this.socket.id)
  }
}

function chat(io) {
  io.on('connection', (socket) => {
    new Connection(io, socket);
  });
};

module.exports = chat;