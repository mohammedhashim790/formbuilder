const express = require('express');
const {v4: uuidv4} = require('uuid');
const {
    PutCommand, QueryCommand, DeleteCommand, UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');
const {docClient} = require('../core/dynamo');

const router = express.Router({mergeParams: true});
const TABLE = process.env.FORM_CONFIGS_TABLE;

// CREATE/attach header config to form
router.post('/:formId/config', async (req, res, next) => {
    try {
        const {header} = req.body; // header = assetId
        const item = {
            formId: req.params.formId, id: uuidv4(), header,
        };

        await docClient.send(new PutCommand({
            TableName: TABLE, Item: item,
        }),);

        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
});

// GET all configs for a form (usually 1)
router.get('/:formId/config', async (req, res, next) => {
    try {
        const result = await docClient.send(new QueryCommand({
            TableName: TABLE,
            KeyConditionExpression: 'formId = :f',
            ExpressionAttributeValues: {':f': req.params.formId},
        }),);

        res.json(result.Items || []);
    } catch (err) {
        next(err);
    }
});

// UPDATE specific config
router.put('/:formId/config/:id', async (req, res, next) => {
    try {
        const {header} = req.body;

        const result = await docClient.send(new UpdateCommand({
            TableName: TABLE, Key: {
                formId: req.params.formId, id: req.params.id,
            }, UpdateExpression: 'SET header = :h', ExpressionAttributeValues: {':h': header}, ReturnValues: 'ALL_NEW',
        }),);

        res.json(result.Attributes);
    } catch (err) {
        next(err);
    }
});

// DELETE config
router.delete('/:formId/config/:id', async (req, res, next) => {
    try {
        await docClient.send(new DeleteCommand({
            TableName: TABLE, Key: {
                formId: req.params.formId, id: req.params.id,
            },
        }),);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
