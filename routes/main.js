const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
   res.locals.user = req.user;
   next();
});

router.get('/', async (req, res, next) => {
  //해당 url 접속시 반응 확인
  res.send('API Server is Running!!!!!!!!!!!!');
});

module.exports = router;