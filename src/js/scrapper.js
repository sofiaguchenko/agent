const puppeteer = require('puppeteer');

/** Scrapper module
 *
 * @param reddit
 * @returns {string}
 * @constructor
 */
// Subreddit link creation
const SUBREDDIT_URL = (reddit) => `https://old.reddit.com/${reddit}/`;

const self = {
    browser: null,
    page: null,

    // Scrapper initialization
    initialize: async (reddit, tn) => {

        // Headless browser launch
        self.browser = await puppeteer.launch({
            headless: true
        });

        // Creation of a new page in puppeteer browser, and results[] declaration
        self.page = await self.browser.newPage();
        let results = [];

        // Try/Catch Block
        try {

            // Going from blank page to current subreddit
            await self.page.goto(SUBREDDIT_URL(reddit), {waitUntil: 'networkidle0', timeout: 0});

            // Creating PostsObject list
            let elements = await self.page.$$('#siteTable > div[class *= "thing"]');

            // Iterating posts, until the post index will be equal to target number(tn)
            for (let element of elements) {
                if (elements.indexOf(element) < tn) {

                    // Scrapping page for necessary information using selectors
                    let title = await element.$eval(('p[class = "title"] > a'), node => node.innerText.trim());

                    let author = await element.$eval(('p[class = "tagline "] > a[class *= "author"]'), node => node.innerText.trim());

                    let authorUrlTemp = await element.$eval(('p[class = "tagline "] > a[class *= "author"]'), node => node.getAttribute('href'));
                    let authorUrl = authorUrlTemp.replace("old.reddit.com", "www.reddit.com");

                    let score = await element.$eval(('div[class = "score unvoted"]'), node => node.innerText.trim());
                    let time = await element.$eval(('p[class = "tagline "] > time'), node => node.getAttribute('title'));

                    let urlTemp = await element.$eval(('li[class = "first"] > a'), node => node.getAttribute('href'));
                    let url = urlTemp.replace("old.reddit.com", "www.reddit.com");

                    let mediaUrl;

                    try {
                        mediaUrl = "https://" + (await element.$eval(('a[class = "thumbnail invisible-when-pinned may-blank outbound"] > img, a[class = "thumbnail invisible-when-pinned may-blank "] > img, a[class = "thumbnail invisible-when-pinned self may-blank "] > img'), node => node.getAttribute('src')));
                    } catch (UnhandledPromiseRejectionWarning) {
                        mediaUrl = "No media";
                    }

                    // Pushing found information into the result list(if no errors caught)
                    results.push({
                        title,
                        author,
                        authorUrl,
                        score,
                        time,
                        url,
                        mediaUrl
                    })
                } else {
                    break
                }
            }
        } catch (TimeoutError){
            // Pushing error information into the result list(if Time Out Error caught)
            results.push({"Error": "TimeoutError"})
        }

        // Returning results
        return results;
    }
}

// Exporting the module
module.exports = self;
