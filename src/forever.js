const { Worker } = require("worker_threads");

function forever() {
    const worker = new Worker(__dirname + "/index.js", { argv: process.argv.slice(2) });

    worker.on("exit", (code) => {
        worker.terminate();
        console.log("Refreshing by forever function...");
        forever();
    });

    worker.on("error", (error) => {
        worker.terminate();
        console.log("Refreshing by forever function...");
        forever();
    });
};

forever();