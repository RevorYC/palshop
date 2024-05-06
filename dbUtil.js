const mysql = require('mysql2');
const fs = require('fs');

class Database {
    constructor(config) {
        this.pool = mysql.createPool(config);
    }

    query(sql, values, operate) {
        return new Promise((resolve, reject) => {
            const queryOptions = values ? { sql, values } : { sql };
            this.pool.query(queryOptions, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }

    insert(table, data) {
        const sql = `INSERT INTO ${table} SET ?`;
        return this.query(sql, data);
    }

    update(table, data, condition) {
        const sql = `UPDATE ${table} SET ? WHERE ${condition}`;
        return this.query(sql, data);
    }

    delete(table, condition) {
        const sql = `DELETE FROM ${table} WHERE ${condition}`;
        return this.query(sql);
    }

    close() {
        this.pool.end();
    }
}
function getDb(){
    const hasConfig = fs.existsSync("../db.js");

    const str = fs.readFileSync("../db.js", "utf8").toString();
    // 创建数据库实例
    const db = new Database({
        host: str||"localhost",
        user: 'pal_db',
        password: 'li12345780',
        database: 'pal_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    return db;
}
module.exports = getDb;