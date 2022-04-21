const os = require('os')
const cluster = require('cluster')
const express = require('express');
const PORT = 7102;
const routes = require('./routes/userroutes')
const dotenv = require('dotenv')
const {MongoClient} = require("mongodb");
const bodyParser = require('body-parser');
const clusterWorkerSize = os.cpus().length

dotenv.config();

const nativeClient = new MongoClient(
    '{{DATABASE_URL}}',
    {
        maxPoolSize: 2000,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

if (clusterWorkerSize > 1) {
    if (cluster.isMaster) {
        for (let i = 0; i < clusterWorkerSize; i++) {
            cluster.fork()
        }

        cluster.on("exit", async (worker) => {
            await console.log("Worker", worker.id, " has exited.")
        })
    } else {
        const app = express()
        app.maxConnections = 100000;


        app.use(bodyParser.json());

        app.use((req, res, next) => {
            req.db = {}
            req.db.native = app.get('db')
            next()
        })

        app.use(routes);
        app.listen(PORT, async () => {
            await console.log(`Express server listening on port ${PORT} and worker ${process.pid}`)
            await nativeClient.connect()
            console.log('Connected to native database')
            app.set('db', nativeClient.db('{{DATABASE_NAME}}'))
        })
    }
} else {
    const app = express()
    app.use(routes);
    app.listen(PORT, async () => {
        await console.log(`Express server listening on port ${PORT} with the single worker ${process.pid}`)
    })
}

// app.use(express.json())
// app.use(routes)
//
// app.get("/", (req, res) => {
//     res.send("Hello World!");
//   });

// app.get("/api/:n", function (req, res) {
//   let n = parseInt(req.params.n);
//   let count = 0;

//   if (n > 5000000000) n = 5000000000;

//   for (let i = 0; i <= n; i++) {
//     count += i;
//   }

//   res.send(`Final count is ${count}`);
// });

// app.listen(port,()=>{
//     console.log(`server is listening at port http://localhost:${port}`)
// })
