const Pool = require('pg').Pool

const connectionString = process.env.DATABASE_URL;

module.exports = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});