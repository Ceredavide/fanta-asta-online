const uuidv4 = require('uuid').v4;

const messages = new Set();
const users = new Map();

const defaultUser = {
  id: 'anon',
  name: 'Anonymous',
};

const testUsers = {
  "1": "davide",
  "2": "giovanni"
}

const messageExpirationTimeMS = 5 * 60 * 1000;

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;
    socket.on("connection", (socket) => this.connect(socket))
    socket.on("check-auth", (value) => this.checkAuth(value))
    socket.on('getMessages', () => this.getMessages());
    socket.on('message', (value) => this.handleMessage(value));
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  checkAuth(userToken) {
    // se il token è valido invia il nome dell utente
    if (Object.keys(testUsers).includes(userToken)) {
      this.io.sockets.emit("res-auth", testUsers[userToken])
    } else {
      this.io.sockets.emit("res-auth", null)
    }
  }

  sendMessage(message) {
    this.io.sockets.emit('message', message);
  }

  getMessages() {
    messages.forEach((message) => this.sendMessage(message));
  }

  handleMessage(value) {
    const message = {
      id: uuidv4(),
      user: users.get(this.socket) || defaultUser,
      value,
      time: Date.now()
    };

    messages.add(message);
    this.sendMessage(message);

    setTimeout(
      () => {
        messages.delete(message);
        this.io.sockets.emit('deleteMessage', message.id);
      },
      messageExpirationTimeMS,
    );
  }

  connect(socket) {
    console.log(minghie)
    console.log(socket)
  }

  disconnect() {
    users.delete(this.socket);
  }
}

function chat(io) {
  io.on('connection', (socket) => {
    new Connection(io, socket);
  });
};

module.exports = chat;