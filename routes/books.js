const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const {
    allBooks,
    bookDetail
} = require('../controller/BookController');

router.use(express.json());

router.get('/', allBooks); // (카테고리별) 전체 도서 조회 
router.get('/:id', bookDetail); // 개별 도서 조회

module.exports = router
=======
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes')
const {allBooks, bookDetail, booksByCategory} = require('../controller/BookController')



router.use(express.json())



//(카테고리별) 전체 도서 조회
router.get('/',allBooks);

//개별 도서 조회
router.get('/:id',bookDetail);



module.exports = router
>>>>>>> 7633904 (docs: 0411)
