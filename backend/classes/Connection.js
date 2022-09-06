const db = require("./Database")

const listone = require("../data/Quotazioni_Fantacalcio_Stagione_2022_23.json")

const activeUsers = new Map();
const settings = new Map();

const userList = [
  {
    nome: "Simone",
    token: "1"
  },
  {
    nome: "Anthony",
    token: "2"
  },
  {
    nome: "Andre",
    token: "3"
  },
  {
    nome: "Andreas",
    token: "4"
  },
  {
    nome: "Davide",
    token: "5"
  },
  {
    nome: "Emanuel",
    token: "6"
  },
  {
    nome: "Giovanni",
    token: "7"
  },
  {
    nome: "Oscar",
    token: "8"
  },
  {
    nome: "Elia",
    token: "9"
  },
  {
    nome: "Nicolas",
    token: "10"
  },
]

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
    socket.on("check-auth", (userToken) => this.checkAuth(userToken));
    socket.on("get-active-users", () => this.changeActiveUsers());
    socket.on('get-asta-status', () => this.getAstaStatus());
    socket.on("active-asta", () => this.activeAsta());
    socket.on("select-giocatore", (giocatore) => this.selectGiocatore(giocatore))
    socket.on("send-proposta", (value) => this.sendProposta(value))
    socket.on('disconnect', () => this.disconnect());
    //   socket.on('connect_error', (err) => {
    //     console.log(`connect_error due to ${err.message}`);
    //   });
  }

  checkAuth(userToken) {

    if (userToken === "admin") {
      this.io.sockets.emit("res-auth", { nome: "Admin" })
      activeUsers.set(this.socket.id, "Admin")
      this.changeActiveUsers()
      return
    }
    //pigliare info utente
    // se il token è valido si cercano i valori nel db e poi li invia al client
    const user = userList.find(user => user.token === userToken)
    if (user) {
      db.getData(user.nome).then((data) => {
        this.io.sockets.emit("res-auth", { ...data })
      })
      activeUsers.set(this.socket.id, user.nome)
      this.changeActiveUsers()
    } else {
      this.socket.emit("res-auth", null)
    }
  }

  changeActiveUsers() {
    this.io.sockets.emit("change-active-users", Array.from(activeUsers.values()))
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
    const user = activeUsers.get(this.socket.id)
    settings.set("proposte", [{ user, value, timestamp: Date.now() }, ...prevState])
    this.getAstaStatus();
  }

  disconnect() {
    activeUsers.delete(this.socket.id);
    this.changeActiveUsers()
  }
}

function chat(io) {
  io.on('connection', (socket) => {
    new Connection(io, socket);
  });
};

module.exports = chat;