const express = require('express');
const {v4: uuidv4} = require('uuid');
const {
    PutCommand, QueryCommand, GetCommand, UpdateCommand, DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const {docClient} = require('../core/dynamo');

const router = express.Router({mergeParams: true});
const TABLE = process.env.FIELDS_TABLE;

// CREATE field for a form
router.post('/:formId/fields', async (req, res, next) => {
    try {
        const {type, order, key, unique} = req.body;

        const item = {
            formId: req.params.formId, id: uuidv4(), type,        // INPUT | CHECKBOX | RADIO_BUTTON | SELECT
            order, key, unique: !!unique,
        };

        await docClient.send(new PutCommand({
            TableName: TABLE, Item: item,
        }),);

        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
});

// LIST fields for a form
router.get('/:formId/fields', async (req, res, next) => {
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

// GET single field
router.get('/:formId/fields/:id', async (req, res, next) => {
    try {
        const result = await docClient.send(new GetCommand({
            TableName: TABLE, Key: {
                formId: req.params.formId, id: req.params.id,
            },
        }),);

        if (!result.Item) {
            return res.status(404).json({error: 'Field not found'});
        }

        res.json(result.Item);
    } catch (err) {
        next(err);
    }
});

// UPDATE field
router.put('/:formId/fields/:id', async (req, res, next) => {
    try {
        const {type, order, key, unique} = req.body;

        const result = await docClient.send(new UpdateCommand({
            TableName: TABLE, Key: {
                formId: req.params.formId, id: req.params.id,
            }, UpdateExpression: 'SET #t = :t, #o = :o, #k = :k, #u = :u', ExpressionAttributeNames: {
                '#t': 'type', '#o': 'order', '#k': 'key', '#u': 'unique',
            }, ExpressionAttributeValues: {
                ':t': type, ':o': order, ':k': key, ':u': !!unique,
            }, ReturnValues: 'ALL_NEW',
        }),);

        res.json(result.Attributes);
    } catch (err) {
        next(err);
    }
});

// DELETE field
router.delete('/:formId/fields/:id', async (req, res, next) => {
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
