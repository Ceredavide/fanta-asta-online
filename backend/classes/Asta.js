const Authentication = require("./Authentication")

const listone = require("../data/Quotazioni_Fantacalcio_Stagione_2022_23.json");
const SoccerPlayer = require("./SoccerPlayer");

const userList = new Authentication().getUserList();

const categoriaGiocatoriList = [
    "Portieri",
    "Difensori",
    "Centrocampisti",
    "Attaccanti"
]

class Asta {
    constructor() {
        this.isAstaOn = false;
        this.categoriaGiocatori = categoriaGiocatoriList[0]
        this.listone = listone[`${this.categoriaGiocatori}`];
        this.currentUser = 0;
        this.giocatoreSelezionato = new SoccerPlayer();
    }

    getAstaStatus(sockets) {
        const data = {
            ...this,
            currentUser: userList[this.currentUser].nome
        }
        sockets.emit("update-asta-status", data)
    }

    getSoccerPlayerStatus(sockets) {
        if(this.giocatoreSelezionato){
            sockets.emit('update-soccer-player-status', this.giocatoreSelezionato.getStatus())
        }
    }

    activeAsta(sockets) {
        this.isAstaOn = true;
        this.getAstaStatus(sockets)
    }

    selectGiocatore(sockets, giocatoreId) {
        const selectedGiocatore = this.listone.find((giocatore) => giocatore.Id === giocatoreId)
        this.giocatoreSelezionato = new SoccerPlayer(selectedGiocatore)
        this.getAstaStatus(sockets)
        this.getSoccerPlayerStatus(sockets)
    }

    leaveGiocatore(sockets, user) {
        const remainedUsers = this.giocatoreSelezionato.leaveGiocatore(user)
        this.getSoccerPlayerStatus(sockets)
    }

    addProposta(sockets, user, value) {
        this.giocatoreSelezionato.addProposta(user, value)
        this.getSoccerPlayerStatus(sockets)
    }
}

module.exports = Asta;