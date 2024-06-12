const ensureAuthorization = require("../auth"); // 인증 모듈
const jwt = require("jsonwebtoken");
const mariadb = require("mysql2/promise");
const { StatusCodes } = require("http-status-codes"); // statud code 모듈

const order = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "localhost",
    user: "root",
    port: 3307,
    password: "Root",
    database: "Bookshop",
    dateStrings: true,
  });

  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else {
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
      req.body;

    // delivery 테이블 삽입
    let sql =
      "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.execute(sql, values);
    let delivery_id = results.insertId;

    // orders 테이블 삽입
    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
                VALUES (?, ?, ?, ?, ?)`;
    values = [
      firstBookTitle,
      totalQuantity,
      totalPrice,
      authorization.id,
      delivery_id,
    ];
    [results] = await conn.execute(sql, values);
    let order_id = results.insertId;

    // items를 가지고, 장바구니에서 book_id, quantity 조회
    sql = "SELECT book_id, quantity FROM cartItems WHERE id IN (?)";
    let [orderItems, fields] = await conn.query(sql, [items]);

    // orderedBook 테이블 삽입
    sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;

    // items.. 배열 : 요소들을 하나씩 꺼내서 (foreach문 돌려서) >
    values = [];
    orderItems.forEach((item) => {
      values.push([order_id, item.book_id, item.quantity]);
    });
    results = await conn.query(sql, [values]);

    let result = await deleteCartItems(conn, items);

    return res.status(StatusCodes.OK).json(result);
  }
};

const deleteCartItems = async (conn, items) => {
  let sql = "DELETE FROM cartItems WHERE id IN (?)";

  let result = await conn.query(sql, [items]);

  if (results.affectedRows == 0)
    return res.status(StatusCodes.BAD_REQUEST).end();

  return result;
};

const getOrders = async (req, res) => {
  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else {
    const conn = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      port: 3307,
      password: "Root",
      database: "Bookshop",
      dateStrings: true,
    });

    let sql = `SELECT orders.id, created_at AS createdAt, address, receiver, contact,
                book_title AS bookTitle, total_quantity AS totalQuantity, total_price AS totalPrice  
                FROM orders LEFT JOIN delivery 
                ON orders.delivery_id = delivery.id
                WHERE user_id = ?`;
    let [rows, fields] = await conn.query(sql, [authorization.id]);
    if (rows.length) return res.status(StatusCodes.OK).json(rows);
    else return res.status(StatusCodes.NOT_FOUND).end();
  }
};

const getOrderDetail = async (req, res) => {
  let authorization = ensureAuthorization(req, res);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 하세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else {
    const orderId = req.params.id;

    const conn = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      port: 3307,
      password: "Root",
      database: "Bookshop",
      dateStrings: true,
    });

    let sql = `SELECT book_id AS bookId, title, author, price, quantity  
                FROM orderedBook LEFT JOIN books 
                ON orderedBook.book_id = books.id
                WHERE order_id=?`;
    let [rows, fields] = await conn.query(sql, [orderId]);

    if (rows.length) return res.status(StatusCodes.OK).json(rows);
    else return res.status(StatusCodes.NOT_FOUND).end();
  }
};

module.exports = {
  order,
  getOrders,
  getOrderDetail,
};
