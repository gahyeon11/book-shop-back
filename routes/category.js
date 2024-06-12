<<<<<<< HEAD

const express = require('express');
const router = express.Router();
const {
    allCategory
} = require('../controller/CategoryController');

router.use(express.json());

router.get('/', allCategory); // 카테고리 전체 목록 조회 
=======
//김가현

const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes')
const {allCategory} = require('../controller/CategoryController')


router.use(express.json())

//카테고리 전체 조회
router.get('/', allCategory);
>>>>>>> 7633904 (docs: 0411)

module.exports = router
