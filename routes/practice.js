const express = require('express');
const { sequelize } = require('../models');
const Word = require('../models/words');
const Script = require('../models/script');

const router = express.Router();


router.post('/script', async(req, res, next) =>{
  try {
    const Script = await Script.create({
      name: req.body.ScriptName,
      content: req.user.ScriptContent,
    });
    
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(async tag => {
          const check = await Hashtag.findOne({ title: tag.slice(1).toLowerCase() });

          if(!check){
            await Hashtag.create({ title: tag.slice(1).toLowerCase() });
          }
          return;
        }),
      );
    }
    res.redirect('/board');
    
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.get('/words', async(req, res, next) => {
  
  var result = new Object();

  try{
    const words = await Word.findAll({
        attributes:['word'],
        order: sequelize.random(),
        //전송할 단어 개수는 여기서 처리
        limit: 50,
        raw: true,
    });
    if(words){
        console.log(words);
        result.error = false;
        result.words = words;
        res.send(result);
    }else{
        result.error = true;
        console.error("단어 조회에 실패했습니다.");
        res.send(result);
    }
    
  }catch(error){
    console.error(error);
    result.error = true;
    res.send(result);
  }
});


  
module.exports = router;
