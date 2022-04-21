const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const fastify = require('fastify')();
const port = 7103;
const ip = '0.0.0.0';
const Controller = require('./controllers/user')
const {MongoClient} = require("mongodb");

const nativeClient = new MongoClient(
    '{{DATABASE_URL}}',
    {
        maxPoolSize: 2000,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', worker => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    let db = {};

    const middleware = (_req, _res, next) => {
        _req.db = {}
        _req.db.native = db
        next()
    }

    fastify.get('/api/case1/:count', {preHandler: [middleware]}, Controller.BulkDataNative);
    fastify.listen(port, ip, async () => {
        await nativeClient.connect();
        db = await nativeClient.db('{{DATABASE_NAME}}')
        console.log(`Fastify "Hello World" listening on port ${port}, PID: ${process.pid}`);
    });
}
