const db = require("./Database")

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

    checkAuth(sockets, socket, userToken) {

        if (userToken === "admin") {
            sockets.emit("res-auth", { nome: "Admin" })
            this.addUser()
            this.sendActiveUsers(sockets)
            return
        }
        //pigliare info utente
        // se il token è valido si cercano i valori nel db e poi li invia al client
        const user = userList.find(user => user.token === userToken)
        if (user) {
            db.getData(user.nome).then((data) => {
                sockets.emit("res-auth", { ...data })
            })
            this.addUser(socket.id, user.nome)
            this.sendActiveUsers(sockets)
        } else {
            socket.emit("res-auth", null)
        }
    }

    getUser(socketId) {
        const user = this.activeUsers.get(socketId)
        return user
    }

    getAllUsers() {
        return Array.from(this.activeUsers.values())
    }

    getUserList() {
        return userList
    }

    addUser(socketId, userName) {
        this.activeUsers.set(socketId, userName || "Admin")
    }

    removeUser(sockets, socketId) {
        this.activeUsers.delete(socketId)
        this.sendActiveUsers(sockets)
    }

    sendActiveUsers(sockets) {
        const users = this.getAllUsers()
        sockets.emit("change-active-users", users)
    }
}

module.exports = Authentication;