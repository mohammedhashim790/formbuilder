const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    region: process.env.AWS_REGION || 'us-east-1', credentials: {
        accessKeyId: process.env.ACCESS_TOKEN, secretAccessKey: process.env.SECRET_TOKEN
    }
});

const S3_BUCKET = process.env.S3_BUCKET || 'default-bucket';

async function putObject(key, data, options = {}) {
    const params = {
        Bucket: S3_BUCKET,
        Key: key,
        Body: typeof data === 'string' ? data : JSON.stringify(data),
        ContentType: options.contentType || 'application/json',
        ...options,
    };

    try {
        const result = await s3.putObject(params).promise();
        return result;
    } catch (error) {
        console.error('Error putting object to S3:', error);
        throw error;
    }
}

async function getObject(key) {
    const params = {
        Bucket: S3_BUCKET,
        Key: key,
    };

    try {
        const result = await s3.getObject(params).promise();
        return JSON.parse(result.Body.toString());
    } catch (error) {
        console.error('Error getting object from S3:', error);
        throw error;
    }
}

async function generateSignedURL(key) {
    const params = {
        Bucket: S3_BUCKET,
        Key: key,
        Expires: expiresIn,
    };

    try {
        const signedUrl = await s3.getSignedUrlPromise('getObject', params);
        return signedUrl;
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
}
module.exports = {
    putObject,
    getObject
};