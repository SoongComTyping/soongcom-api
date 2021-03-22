const express = require('express');
const router = express.Router();

/*라우터 연결 관리 부분 */
const mainRouter = require('./main');

router.use('/', mainRouter);


module.exports = router;