const conn = require('../mariadb'); // db 모듈
const {StatusCodes} = require('http-status-codes'); // statud code 모듈

const allCategory = (req,res) => {
    
    // 카테고리 전체 목록 리스트    
    let sql = "SELECT category_id AS id, category_name AS name FROM category";
    conn.query(sql, (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    })
};

module.exports = {
    allCategory
};