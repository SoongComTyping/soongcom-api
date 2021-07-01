const express = require('express');
const { sequelize } = require('../models');
const Word = require('../models/words');
const WordEng = require('../models/wordsEng');
const Script = require('../models/script');
const ScriptCount = require('../models/scriptCount');
const router = express.Router();

router.get('/character', async (req, res, next) => {
  const { level, language } = req.query;


  const koreanKeys = [
    [],
    ['ㅅ', 'ㄴ', 'ㄱ', 'ㅇ', 'ㅂ', 'ㄷ', 'ㄱ'],
    ['ㅁ', 'ㄴ', 'ㅇ', 'ㅂ', 'ㄷ', 'ㅇ', 'ㄹ', 'ㄱ', 'ㅈ', 'ㅁ', 'ㅈ'],
    ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅜ', 'ㅣ', 'ㅐ'],
    ['ㅑ', 'ㅒ', 'ㅖ', 'ㅒ', 'ㅠ', 'ㅛ', 'ㅠ', '.', '.', 'ㅎ'],
    ['ㄱ', 'ㄷ', 'ㅑ', 'ㅏ', 'ㅕ', 'ㅛ', 'ㅠ', 'ㅏ', 'ㅣ', 'ㅋ'],
    ['?', 'ㄷ', 'ㄹ', 'ㄱ', ',', 'ㅠ', '.', 'ㅍ', 'ㅎ', 'ㅌ'],
    [],
    [],
  ];

  const englishKeys = [
    [],
    ['a', 'b', 'c', 's', 'd', 'f', 'a', 'b', 's'],
    ['q', 'w', 'e', 't', 'r', 'f', 'g', 'a', 'd'],
    ['u', 'i', 'l', 'o', 'o', 'u', 'i', 'j', 'i'],
    ['n', 'm', 'm', 'b', 'c', 'x', 'z', 'v', 'c'],
    [..."apple.astonish"],
    [..."thisisthebest"],
    [..."amazonprime"],
    [],
  ];

  if (language === 'korean') {
    return res.status(200).json({
      code: 200,
      data: koreanKeys[level],
    });
  }

  if (language === 'english') {
    return res.status(200).json({
      code: 200,
      data: englishKeys[level],
    });
  }

  return res.status(403).json({
    code: 403,
    error: `language: ${language} is not supported`,
    data: [],
  });
});

router.get('/words', async (req, res, next) => {

  const lang = req.query.language;

  try {
    var words;
    if (lang == "kor") {
      words = await Word.findAll({
        attributes: ['word'],
        order: sequelize.random(),
        //전송할 단어 개수는 여기서 처리
        limit: 50,
        raw: true,
      });
    } else {
      words = await WordEng.findAll({
        attributes: ['word'],
        order: sequelize.random(),
        //전송할 단어 개수는 여기서 처리
        limit: 50,
        raw: true,
      });
    }

    var trans = [];
    for (var i = 0; i < words.length; i++) {
      trans[i] = words[i].word;
    }
    console.log(trans);
    return res.status(200).json({
      code: 200,
      message: "단어 조회 성공",
      words: trans,
    })

  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Server Error",
    });
  }
});


router.get('/list', async (req, res, next) => {
  try {
    const list = await Script.findAll({
      attributes: ['id', 'name', 'date'],
      raw: true,
    });

    return res.status(200).json({
      code: 200,
      message: "list 전송 성공",
      list: list,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Server Error",
    });
  }
});

router.get('/script', async (req, res, next) => {
  var id = req.query.id;
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

  try {
    if (!req.body.wrongTyping) {
      return res.status(200).json({
        code: 200,
        message: "오타 없음",
      });
    }

    const wrongTyping = req.body.wrongTyping;

    const keys = Object.getOwnPropertyNames(wrongTyping);

    //전체 오타수 count
    const total = Object.values(wrongTyping).reduce(function add(sum, currValue) {
      return sum + currValue;
    }, 0);

    var wrongEach = {};
    for (var i = 0; i < keys.length; i++) {
      wrongEach[keys[i]] = (wrongTyping[keys[i]] / total * 100).toFixed(1);
    }
    const scriptCounts = await ScriptCount.findAll({ raw: true });
    let scriptScore = {};

    for (var i = 0; i < scriptCounts.length; i++) {

      for (var j = 0; j < keys.length; j++) {
        if (scriptCounts[i].alphabet == keys[j]) {
          scriptScore[scriptCounts[i].id] = (isNaN(scriptScore[scriptCounts[i].id]) ? 0 : scriptScore[scriptCounts[i].id]) + scriptCounts[i].count * wrongEach[keys[j]];
        }
      }
    }

    var sortScript = [];

    for (var key in scriptScore) {
      sortScript.push([key, scriptScore[key]]);
    }

    sortScript.sort(function (a, b) {
      return b[1] - a[1];
    });


    var list = [];
    for (var i = 0; i < 5; i++) {
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
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Server Error",
    })
  }
});

module.exports = router;
