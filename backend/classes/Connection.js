const Authentication = require("./Authentication")

const listone = require("../data/Quotazioni_Fantacalcio_Stagione_2022_23.json")

const auth = new Authentication();
const settings = new Map();

const categoriaGiocatoriList = [
  "Portieri",
  "Difensori",
  "Centrocampisti",
  "Attaccanti"
]

settings.set("listone", listone)
settings.set("isAstaOn", false);
settings.set("categoriaGiocatori", categoriaGiocatoriList[0]);
settings.set("giocatoreSelezionato", null)
settings.set("proposte", [])
settings.set("currentUser", 0)


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

    socket.on('get-asta-status', () => this.getAstaStatus());

    socket.on("active-asta", () => this.activeAsta());
    socket.on("select-giocatore", (giocatore) => this.selectGiocatore(giocatore))
    socket.on("send-proposta", (value) => this.sendProposta(value))
    socket.on('disconnect', () => this.disconnect());
    //   socket.on('connect_error', (err) => {
    //     console.log(`connect_error due to ${err.message}`);
    //   });
  }

  getAstaStatus() {
    const data = Object.fromEntries(settings)
    this.io.sockets.emit("update-asta-status", { ...data, currentUser: userList[data.currentUser].nome })
  }

  activeAsta() {
    settings.set("isAstaOn", true),
      this.getAstaStatus()
  }

  selectGiocatore(giocatore) {
    settings.set("giocatoreSelezionato", giocatore)
    this.getAstaStatus()
  }

  sendProposta(value) {
    const prevState = settings.get("proposte")
    const user = auth.getUser(this.socket.id)
    settings.set("proposte", [{ user, value, timestamp: Date.now() }, ...prevState])
    this.getAstaStatus();
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