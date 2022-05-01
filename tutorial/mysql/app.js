const express = require('express')
const app = express()
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'nuwavqaq@localhost',
  port: '3306',
  user: 'nuwavqaq_nuwavqaq',
  password: '123!@#QWEqwe',
  database: 'nuwavqaq_main'
})

connection.connect((err) => {
  if (err) throw err
  console.log('Connected to MySQL Server!')
})

let SQL = 'SELECT * from articles'
app.get('/', (req, res) => {
  connection.query(SQL, (err, rows) => {
    if (err) throw err
    console.log('The data from users table are: \n', rows)
    connection.end()
  })
})

app.listen(3000, () => {
  console.log('Server is running at port 3000')
})