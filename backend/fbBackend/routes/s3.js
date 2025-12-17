const express = require('express');
const {putObject, getObject} = require("../core/s3");

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const {key, data, options} = req.body;

        const result = await putObject(key, data, options);

        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});

router.get('/:key', async (req, res, next) => {
    try {
        const result = await getObject(req.params.key);

        res.json(result);
    } catch (err) {
        next(err);
    }
});

module.exports = router;