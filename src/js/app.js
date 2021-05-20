const scrapper = require('./scrapper');
const fs = require('fs');
const chalk = require('chalk')
const cliProgress = require('cli-progress')

// Config load
let config = require('../config/config.json')

let Queue = require('queue-promise')

/**
 * Creating an app, that initialize the scrapper, saves results and shows IRT progress
 *
 * @returns {file}
 */
// Declaration of scrapping function
async function processing () {

    // Declaration of resulted data[] list
    let data = []

    // Queue declaration
    const queue = new Queue({
        concurrent: 1,
        interval: 5
    });

    // Progress bar declaration with given format
    const progressBar = new cliProgress.SingleBar({
        format: '{bar} {percentage}% | {value}/{total} | elapsed: {duration_formatted} | estimated: {eta_formatted} Current Source: ' + chalk.blue('{source}'),
        hideCursor: true
    })

    // Progress bar start
    progressBar.start(config.length, 0)

    // Progress bar update on queue step resolve
    queue.on("resolve", () => {
        progressBar.update(data.length, {source: channel.source})
    })

    // Progress bar stop on the queue end
    queue.on('end', () => {
        progressBar.stop()

        // Writing found data in .json file
        fs.writeFileSync(
            'src/config/collectedData.json',
            JSON.stringify(data, null, " ")
        )

        console.log("Finished")
    })

    // Iteration through config and scrapping data for each source in config
    config.forEach(channel => {
        queue.enqueue(() => scrapper.initialize(channel["source"], 1).then( res => {
            data.push({"Source": channel["source"], "Response": res})
            progressBar.update(data.length, {source: channel.source})
            return res
        }))
    })

    // Queue start
    queue.start()

}

// Scrapper call
processing()
