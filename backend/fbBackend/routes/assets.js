const express = require('express');
const {v4: uuidv4} = require('uuid');
const {
    PutCommand, GetCommand, DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const {docClient} = require('../core/dynamo');

const router = express.Router();
const TABLE = process.env.ASSETS_TABLE;

// CREATE asset
router.post('/', async (req, res, next) => {
    try {
        const {key, prefix, bucket, region} = req.body;

        const item = {
            id: uuidv4(), key, prefix, bucket, region,
        };

        await docClient.send(new PutCommand({
            TableName: TABLE, Item: item,
        }),);

        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
});

// GET asset
router.get('/:id', async (req, res, next) => {
    try {
        const result = await docClient.send(new GetCommand({
            TableName: TABLE, Key: {id: req.params.id},
        }),);

        if (!result.Item) {
            return res.status(404).json({error: 'Asset not found'});
        }

        res.json(result.Item);
    } catch (err) {
        next(err);
    }
});

// DELETE asset
router.delete('/:id', async (req, res, next) => {
    try {
        await docClient.send(new DeleteCommand({
            TableName: TABLE, Key: {id: req.params.id},
        }),);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
