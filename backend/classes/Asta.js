const Authentication = require("./Authentication")

const listone = require("../data/Quotazioni_Fantacalcio_Stagione_2022_23.json")

const auth = new Authentication();

const userList = auth.getUserList();

const categoriaGiocatoriList = [
    "Portieri",
    "Difensori",
    "Centrocampisti",
    "Attaccanti"
]

class Asta {
    constructor() {
        this.isAstaOn = false;
        this.listone = listone;
        this.categoriaGiocatori = categoriaGiocatoriList[0]
        this.currentUser = 0;
        this.giocatoreSelezionato = null;
        this.proposte = []
    }

    getAstaStatus(sockets) {
        const data = {
            ...this,
            currentUser: userList[this.currentUser].nome
        }
        sockets.emit("update-asta-status", data)
    }

    activeAsta(sockets) {
        this.isAstaOn = true;
        this.getAstaStatus(sockets)
    }

    selectGiocatore(sockets, giocatore) {
        this.giocatoreSelezionato = giocatore
        this.getAstaStatus(sockets)
    }

    sendProposta(sockets, user, value) {
        const prevState = this.proposte;
        this.proposte = [{ user, value, timestamp: Date.now() }, ...prevState]
        this.getAstaStatus(sockets);
    }
}

module.exports = Asta;