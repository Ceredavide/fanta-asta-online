const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/db.sqlite');

class Database {
    getData(userNome) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM asta WHERE nome  = ?`, [userNome], (err, row) => {
                if (err) {
                    console.error(err.message);
                    reject(err)
                }
                if (row) {
                    resolve(row)
                } else {
                    // nel caso non ci fosse una colonna la creo
                    db.run('INSERT INTO asta(nome, crediti, orario, squadra) VALUES(?,?,?,?)', [userNome, 500, Date.now(), "{}"], (err) => {
                        if (err) {
                            return console.log(err.message);
                        }
                        console.log('Inizializzato squadra per utente ' + userNome);
                        this.getData(userNome)
                    })
                }
            });
        })
    }
}

module.exports = new Database;