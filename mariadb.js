//mysql 모듈 소환
const mysql = require('mysql2');

//db와 연결 통로 생성
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3307,
  password: 'Root',
  database: 'Bookshop',
  dateStrings: true
});

module.exports = connection;