<<<<<<< HEAD
const conn = require('../mariadb'); // db 모듈
const {StatusCodes} = require('http-status-codes'); // statud code 모듈
const jwt = require('jsonwebtoken'); // jwt 모듈
const crypto = require('crypto'); // crypto 모듈 : 암호화
const dotenv = require('dotenv'); // dotenv 모듈
=======
//0410 김가현

const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes')

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
const crypto = require('crypto');

const { query } = require('express');

>>>>>>> 7633904 (docs: 0411)
dotenv.config();

const join = (req,res) => {
    const {email, password} = req.body;

<<<<<<< HEAD
    let sql = 'INSERT INTO users (email, password, salt) VALUES (?, ?, ?)';
    
    // 암호화된 비밀번호와 salt 값을 같이 DB에 저장 
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
    
    let values = [email, hashPassword, salt];
    conn.query(sql, values,
=======
    let sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`

    // 암호화된 비밀번호와 salt 값을 db에 저장한다. 
    const salt = crypto.randomBytes(10).toString('base64')
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64')
    // 회원가입 시 비밀번호를 암호화해서 암호화된 비밀번호와, salt값을 같이 저장

    let values = [email, hashPassword, salt]
    conn.query(
        sql, values,
>>>>>>> 7633904 (docs: 0411)
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.affectedRows)
                return res.status(StatusCodes.CREATED).json(results);
            else
                return res.status(StatusCodes.BAD_REQUEST).end();
        })
};

const login = (req,res) => {
    const {email, password} = req.body;

    let sql = 'SELECT * FROM users WHERE email = ?';
    conn.query(sql, email,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0];

            // salt값 꺼내서 날 것으로 들어온 비밀번호를 암호화 해보고
            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64');

            // => 디비 비밀번호랑 비교 
            if(loginUser && loginUser.password == hashPassword) {
                // 토큰 발행
                const token = jwt.sign({
                    id : loginUser.id,
                    email : loginUser.email
                }, process.env.PRIVATE_KEY, {
                    expiresIn : '100m',
                    issuer : "gh"
                });

                // 토큰 쿠키에 담기
                res.cookie("token", token, {
                    httpOnly : true
                });
                console.log(token);

                return res.status(StatusCodes.OK).json({
                    ...results[0],
                    token: token
                }); 
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
<<<<<<< HEAD
        })
};

const passwordResetRequest = (req,res) => {
    const {email} = req.body;
=======
            else {
                res.status(StatusCodes.UNAUTHORIZED).end()  //401: Unauthorized 403: Forbidden 접근 권한 없음
            }
        }
    );
}
//김가현
const passwordResetRequest = (req, res) => {
>>>>>>> 7633904 (docs: 0411)

    let sql = 'SELECT * FROM users WHERE email = ?';
    conn.query(sql, email,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            // 이메일로 유저가 있는지 찾아봅니다!
            const user = results[0];
            if (user) {
                return res.status(StatusCodes.OK).json({
                    email : email
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
<<<<<<< HEAD
=======

        })
}

const passwordReset = (req, res) => {
    const { email, password } = req.body;

    let sql = `UPDATE users SET password = ?, salt=? WHERE email=?`

    // 암호화된 비밀번호와 salt 값을 db에 저장한다. 
    const salt = crypto.randomBytes(10).toString('base64')
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64')


    let values = [hashPassword, salt, email]
    conn.query(
        sql, values,
        (err, results) => {
            if (err) {
                console.log(err)
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            if (results.affectedRows == 0) {
                return res.status(StatusCodes.BAD_REQUEST).end()
            } else {
                return res.status(StatusCodes.OK).json(results)
            }


>>>>>>> 7633904 (docs: 0411)
        }
    )
};

const passwordReset = (req,res) => {
    const {email, password} = req.body;

    let sql = `UPDATE users SET password=?, salt=? WHERE email=?`;

    // 암호화된 비밀번호와 salt 값을 같이 DB에 저장 
    const salt = crypto.randomBytes(10).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let values = [hashPassword, salt, email];
    conn.query(sql, values, 
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.affectedRows == 0)
                return res.status(StatusCodes.BAD_REQUEST).end();
            else
                return res.status(StatusCodes.OK).json(results);
        }
    )
};

module.exports = {
    join, 
    login, 
    passwordResetRequest, 
    passwordReset
};