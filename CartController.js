const ensureAuthorization = require('../auth'); // 인증 모듈
const conn = require('../mariadb'); // db 모듈
const {StatusCodes} = require('http-status-codes'); // statud code 모듈
const jwt = require('jsonwebtoken');

// 장바구니 담기
const addToCart = (req, res) => {
    const { book_id, quantity } = req.body;

    // book_id 검증
    if (!book_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "Book ID is required."
        });
    }

    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        });
    } else {
        let sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)";
        let values = [book_id, quantity || 1, authorization.id];
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
        });
    }
};


// 장바구니 아이템 목록 조회
const getCartItems = (req, res) => {
    const { selected } = req.body; // selected = [1, 3]

    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        });
    } else {
        let sql = `SELECT cartItems.id, book_id AS bookId, title, summary, quantity, price 
                FROM cartItems LEFT JOIN books 
                ON cartItems.book_id = books.id
                WHERE user_id=?`;
        let values = [authorization.id];

        if (selected) { // 주문서 작성 시 '선택한 장바구니 목록 조회'
            sql += ` AND cartItems.id IN (?)`;
            values.push(selected);
        }

        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        });
    }
};


// 장바구니 아이템 삭제
const removeCartItem = (req, res) => {
    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        });
    } else {
        const cartItemId = req.params.id;

        let sql = "DELETE FROM cartItems WHERE id = ?";
        conn.query(sql, [cartItemId], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
        });
    }
};


module.exports = {
    addToCart,
    getCartItems,
    removeCartItem
}