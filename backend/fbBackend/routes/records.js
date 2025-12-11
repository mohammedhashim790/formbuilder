const express = require('express');
const {v4: uuidv4} = require('uuid');
const {
    PutCommand, QueryCommand, GetCommand,
} = require('@aws-sdk/lib-dynamodb');
const {docClient} = require('../db/dynamo');

const router = express.Router({mergeParams: true});
const TABLE = process.env.RECORDS_TABLE;

// CREATE record for a form
router.post('/:formId/records', async (req, res, next) => {
    try {
        const {record} = req.body; // any JSON

        const item = {
            formId: req.params.formId,
            id: uuidv4(),
            record: JSON.stringify(record),
            createdAt: new Date().toISOString(),
        };

        await docClient.send(new PutCommand({
            TableName: TABLE, Item: item,
        }),);

        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
});

// LIST records for a form
router.get('/:formId/records', async (req, res, next) => {
    try {
        const result = await docClient.send(new QueryCommand({
            TableName: TABLE,
            KeyConditionExpression: 'formId = :f',
            ExpressionAttributeValues: {':f': req.params.formId},
        }),);

        const items = (result.Items || []).map(r => ({
            ...r, record: JSON.parse(r.record),
        }));

        res.json(items);
    } catch (err) {
        next(err);
    }
});

// GET single record
router.get('/:formId/records/:id', async (req, res, next) => {
    try {
        const result = await docClient.send(new GetCommand({
            TableName: TABLE, Key: {
                formId: req.params.formId, id: req.params.id,
            },
        }),);

        if (!result.Item) {
            return res.status(404).json({error: 'Record not found'});
        }

        const item = {
            ...result.Item, record: JSON.parse(result.Item.record),
        };

        res.json(item);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
