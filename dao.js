const sqlite3 = require('sqlite3')
const Promise = require('bluebird')
const dotenv = require('dotenv');
dotenv.config();

class AppDAO {
  constructor() {
    this.db = new sqlite3.Database(process.env.dbPath, (err) => {
      if (err) {
        console.log('Could not connect to database:', err)
      } else {
        this.ensureTable();
      }
    })
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(this.changes)
        }
      })
    })
  }

  insertSubscription(sub) {
    const sql = `INSERT OR IGNORE INTO subscriptions (endpoint, p256dh, auth) VALUES (
      '${sub.endpoint}',
      '${sub.p256dh}',
      '${sub.auth}'
    )`
    return this.run(sql);
  }

  deleteSubscription(sub) {
    const sql = `DELETE FROM subscriptions WHERE p256dh = '${sub.keys.p256dh}' AND auth = '${sub.keys.auth}'`
    return this.run(sql);
  }

  getAllSubscriptions() {
    const sql = 'SELECT * FROM subscriptions';
    return new Promise((resolve, reject) => {
      this.db.all(sql, (err, rows) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  ensureTable() {
    const sql = `CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT,
      p256dh TEXT UNIQUE,
      auth TEXT)`
    return this.run(sql)
  }
}

module.exports = AppDAO