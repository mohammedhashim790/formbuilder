const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1', credentials: {
        accessKeyId: process.env.ACCESS_TOKEN, secretAccessKey: process.env.SECRET_TOKEN
    }
});

const docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {removeUndefinedValues: true},
});

module.exports = {docClient};
