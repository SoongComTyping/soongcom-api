const express = require('express');
const { QueryTypes, sequelize } = require('../models');
const Script = require('../models/script');
const ScriptCount = require('../models/scriptCount');
const router = express.Router();


function getConut(arr) {

    return arr.reduce((pv, cv) => {
        pv[cv] = (pv[cv] || 0) + 1;
        return pv;
    }, {});
}

router.post('/script', async (req, res, next) => {
    console.log(req.body);

    try {
        const newScript = await Script.create({
            name: req.body.ScriptName,
            content: req.body.ScriptContent,
        });

        const arr = req.body.ScriptContent.toLowerCase().match(/[a-z]/gi);

        const total = arr.length;

        const counts = getConut(arr);

        for (const key of Object.keys(counts)) {
            console.log(key + ":" + counts[key]);
            await ScriptCount.create({
                id: newScript.id,
                alphabet: key,
                count: counts[key]/total*100,
            });
        }

        return res.status(200).json({
            code: 200,
            message: "스크립트 등록 성공",
        });

    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "스크립트 등록 오류",
            error: error,
        });
    }
})

module.exports = router;
