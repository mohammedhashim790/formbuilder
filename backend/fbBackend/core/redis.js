const Redis = require('ioredis');

// const redis = new Redis({
//     host: process.env.REDIS_HOST,
//     port: Number(process.env.REDIS_PORT || 6379),
//     connectTimeout: 1000,
//     maxRetriesPerRequest: 1,
//     retryStrategy: (times) => {
//         return Math.min(times * 100, 2000);
//     },
// });

// module.exports = redis;