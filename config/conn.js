const mysql = require('mysql2')
const { mysqldb } = require('./.env')

const connection = mysql.createConnection({
    mysqldb
  })

  module.exports = connection