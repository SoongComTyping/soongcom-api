const express = require('express');
const router = express.Router();

/*라우터 연결 관리 부분 */
const mainRouter = require('./main');
const rankingRouter = require('./ranking');
const practiceRouter = require('./practice');

router.use('/', mainRouter);
router.use('/rank', rankingRouter);
router.use('/practice', practiceRouter);


module.exports = router;