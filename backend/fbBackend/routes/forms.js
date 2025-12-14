const express = require('express');
const {v4: uuidv4} = require('uuid');
const {
    PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');
const {docClient} = require('../core/dynamo');

const router = express.Router();
const TABLE = process.env.FORMS_TABLE;


const shortUUid = require('short-uuid')

// CREATE form
router.post('/', async (req, res, next) => {
    try {
        const {name, desc, fields} = req.body;
        const userId = req.headers['user_id'];

        const now = new Date().toISOString();
        const item = {
            id: uuidv4(), title: name, desc, userId, fields, createdAt: now, updatedAt: now, link: shortUUid.generate()
        };

        await docClient.send(new PutCommand({
            TableName: TABLE, Item: item,
        }));

        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
});

// LIST forms
router.get('/', async (_req, res, next) => {
    try {
        const result = await docClient.send(new ScanCommand({TableName: TABLE}),);
        res.json(result.Items || []);
    } catch (err) {
        next(err);
    }
});

// GET form by id
router.get('/:id', async (req, res, next) => {
    try {
        const result = await docClient.send(new GetCommand({
            TableName: TABLE, Key: {id: req.params.id},
        }));

        if (!result.Item) {
            return res.status(404).json({error: 'Form not found'});
        }
        res.json(result.Item);
    } catch (err) {
        next(err);
    }
});

router.get('getByShortId/:shortId', async (req, res, next) => {
    try {
        const result = await docClient.send(new GetCommand({
            TableName: TABLE, Key: {id: req.params.shortId},
        }),);

        if (!result.Item) {
            return res.status(404).json({error: 'Form not found'});
        }

        res.json(result.Item);
    } catch (err) {
        next(err);
    }
});


// UPDATE form
router.put('/:id', async (req, res, next) => {
    try {
        const {formName, title, desc} = req.body;
        const updatedAt = new Date().toISOString();

        const result = await docClient.send(new UpdateCommand({
            TableName: TABLE,
            Key: {id: req.params.id},
            UpdateExpression: 'SET formName = :formName, title = :title, #d = :desc, updatedAt = :updatedAt',
            ExpressionAttributeNames: {
                '#d': 'desc',
            },
            ExpressionAttributeValues: {
                ':formName': formName, ':title': title, ':desc': desc, ':updatedAt': updatedAt,
            },
            ReturnValues: 'ALL_NEW',
        }),);

        res.json(result.Attributes);
    } catch (err) {
        next(err);
    }
});

// DELETE form
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
