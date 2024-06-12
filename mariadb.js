//mysql 모듈 소환
const mysql = require('mysql2');

//db와 연결 통로 생성
const connection = mysql.createConnection({
<<<<<<< HEAD
  host: 'localhost',
  user: 'root',
  port: 3307,
  password: 'Root',
  database: 'Bookshop',
  dateStrings: true
});

=======
    host: 'localhost',
    user: 'root',
    port: 3307,
    password: 'Root',
    database: 'Bookshop',
    dateStrings:true
  });
  
>>>>>>> 7633904 (docs: 0411)
module.exports = connection;