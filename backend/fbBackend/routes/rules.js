const express = require('express');
const {v4: uuidv4} = require('uuid');
const {
    PutCommand, QueryCommand, DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const {docClient} = require('../db/dynamo');

const router = express.Router({mergeParams: true});
const TABLE = process.env.RULES_TABLE;

// CREATE rule for a field
router.post('/:fieldId/rules', async (req, res, next) => {
    try {
        const {rule} = req.body;

        const item = {
            fieldId: req.params.fieldId, id: uuidv4(), rule,
        };

        await docClient.send(new PutCommand({
            TableName: TABLE, Item: item,
        }),);

        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
});

// LIST rules for a field
router.get('/:fieldId/rules', async (req, res, next) => {
    try {
        const result = await docClient.send(new QueryCommand({
            TableName: TABLE,
            KeyConditionExpression: 'fieldId = :f',
            ExpressionAttributeValues: {':f': req.params.fieldId},
        }),);

        res.json(result.Items || []);
    } catch (err) {
        next(err);
    }
});

// DELETE rule (fieldId + id required)
router.delete('/:fieldId/rules/:id', async (req, res, next) => {
    try {
        await docClient.send(new DeleteCommand({
            TableName: TABLE, Key: {
                fieldId: req.params.fieldId, id: req.params.id,
            },
        }),);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
