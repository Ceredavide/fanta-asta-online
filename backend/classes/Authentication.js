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

class Authentication {
    constructor() {
        this.activeUsers = new Map();
    }

    checkAuth(sockets, userToken) {

        if (userToken === "admin") {
            sockets.emit("res-auth", { nome: "Admin" })
            this.addUser()
            this.changeActiveUsers(sockets)
            return
        }
        //pigliare info utente
        // se il token è valido si cercano i valori nel db e poi li invia al client
        const user = userList.find(user => user.token === userToken)
        if (user) {
            db.getData(user.nome).then((data) => {
                sockets.emit("res-auth", { ...data })
            })
            this.addUser(this.socket.id, user.nome)
            this.changeActiveUsers()
        } else {
            this.socket.emit("res-auth", null)
        }
    }

    addUser(socketId, userName) {
        this.activeUsers.set(socketId, userName || "Admin")
    }

    removeUser(socketId) {
        this.activeUsers.delete(socketId)
    }

    changeActiveUsers(sockets) {
        sockets.emit("change-active-users", Array.from(activeUsers.values()))
    }
}

module.exports = Authentication;