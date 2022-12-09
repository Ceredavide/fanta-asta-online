class SoccerPlayer {
    constructor(soccerPlayer = null) {
        this.selectedSoccerPlayer = soccerPlayer;
        this.highestProposta = null;
        this.proposte = []
        this.usersOut = []
    }

    /**
     * Removes the passed user from the asta for the current player 
     * @param {Object} user  the users who leave the asta for the current player
     * @returns the number of remained users for the current player
     */
    leaveGiocatore(user) {
        this.usersOut = [...this.usersOut, user]
        return this.usersOut.length
    }

    /**
     * Add a new proposta for the current player
     * @param {Object} user    the user who made the proposta
     * @param {int} value the value of the proposta
     */
    addProposta(user, value) {
        if (!this.highestProposta) {
            this.highestProposta = { user, value, timestamp: Date.now() }
        }else if(value > this.highestProposta.value){
            this.proposte.push(this.highestProposta)
            this.highestProposta = { user, value, timestamp: Date.now() }
        }else{
            // TODO: Errore: offerta troppo bassa
        }
    }

    /**
     * Returns the current state of SoccerPlayer
     * @returns the current state of SoccerPlayer
     */
    getStatus() { return this }
}

module.exports = SoccerPlayer;