const express = require('express');
const router = express.Router();

/*라우터 연결 관리 부분 */
const mainRouter = require('./main');
const rankingRouter = require('./ranking');

router.use('/', mainRouter);
router.use('/rank', rankingRouter);


module.exports = router;