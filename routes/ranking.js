const express = require('express');
const Ranking = require('../models/ranking');

const router = express.Router();


router.get('/list', async(req, res, next) => {
  console.log("랭킹 리스트 전송");
  var result = new Object();
  var script = req.query.script;

  try{
    const rankingList = await Ranking.findAll({
        where: {script: script},
        attributes:['script', 'nickname', 'score', 'date'],
        order: [['score', 'DESC']],
        raw: true,
    });
    if(rankingList){
        console.log(rankingList);
        result.error = false;
        result.list = rankingList;
        res.send(result);
    }else{
        result.error = true;
        console.error("해당하는 스크립트가 존재하지 않습니다.");
        res.send(result);
    }
    
  }catch(error){
    console.error(error);
    result.error = true;
    res.send(result);
  }
});


  
module.exports = router;
