const express = require('express');
const { sequelize } = require('../models');
const Word = require('../models/words');
const Script = require('../models/script');
const ScriptCount = require('../models/scriptCount');
const router = express.Router();


router.get('/words', async (req, res, next) => {

  var result = new Object();

  try {
    const words = await Word.findAll({
      attributes: ['word'],
      order: sequelize.random(),
      //전송할 단어 개수는 여기서 처리
      limit: 50,
      raw: true,
    });
    if (words) {
      console.log(words);
      result.error = false;
      result.words = words;
      res.send(result);
    } else {
      result.error = true;
      console.error("단어 조회에 실패했습니다.");
      res.send(result);
    }

  } catch (error) {
    console.error(error);
    result.error = true;
    res.send(result);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const list = await Script.findAll({
      attributes: ['name', 'date'],
      raw: true,
    });

    return res.status(200).json({
      code: 200,
      list: list,
      message: "list 전송 성공",
    });
  } catch (error) {

  }
})

router.get('/script', async (req, res, next) => {
  var id = req.query.id;
  console.log("script id : " + id);

  try {
    const script = await Script.findOne({
      where: { id: id },
      attributes: ['id', 'name', 'content'],
      raw: true,
    });

    return res.status(200).json({
      code: 200,
      script: script,
      message: "스크립트 전송",
    });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "스크립트 전송 오류",
    })
  }
});

router.post('/script/complete', async (req, res, next) => {
  const wrongTyping = req.body.wrongTyping;

  const keys = Object.getOwnPropertyNames(wrongTyping);
  const values = Object.values(wrongTyping);

  //전체 오타수 count
  const total = values.reduce(function add(sum, currValue){
    return sum + currValue;
  }, 0);

  var wrongEach = {};
  for(var i = 0; i<keys.length; i++){
    wrongEach[keys[i]] = (wrongTyping[keys[i]]/total * 100).toFixed(1);
  }
  const scriptCounts = await ScriptCount.findAll({ raw: true });
  let scriptScore = {};

  for(var i =0; i< scriptCounts.length; i++){

    for(var j=0; j<keys.length; j++){
      if(scriptCounts[i].alphabet == keys[j]){
        scriptScore[scriptCounts[i].id] = (isNaN(scriptScore[scriptCounts[i].id])? 0 : scriptScore[scriptCounts[i].id]) + scriptCounts[i].count * wrongEach[keys[j]];
      }
    }
  }

  var sortScript = [];

  for(var key in scriptScore){
    sortScript.push([key, scriptScore[key]]);
  }
  sortScript.sort(function(a, b) {
    return b[1] - a[1];
  });

  console.log(sortScript.slice(0,3));

  var list = [];
  for(var i=0; i<3; i++){
     list[i] = await Script.findOne({
       where: { id: sortScript[i] },
       attributes: ['id', 'name'],
       raw: true,
     })
   }


  console.log(list);
  return res.status(200).json({
    code: 200,
    message: "추천 스크립트 리스트 전송",
    list: list,
  });
});

module.exports = router;
