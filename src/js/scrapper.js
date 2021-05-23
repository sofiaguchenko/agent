let cheerio = require('cheerio');
let axios = require('axios');

// Subreddit link creation
const SUBREDDIT_URL = (reddit) => `https://old.reddit.com/${reddit}/`;

const self = {

    // Scrapper initialization
    initialize: async (reddit, tn) => {

        let results = [];

        // Try/Catch Block
        // try {

        await axios.get(SUBREDDIT_URL(reddit)).then(urlResponse => {
            const $ = cheerio.load(urlResponse.data);


            $('div.thing').each((i, element) => {
                if(i < tn) {
                    const title = $(element).find('p.title > a').text();

                    let author = $(element).find('p.tagline > a.author').text();

                    let authorUrlTemp = $(element).find('p.tagline > a.author').attr('href');
                    let authorUrl = authorUrlTemp.replace("old.reddit.com", "www.reddit.com");

                    let score = $(element).find('div.score.unvoted').text();
                    let time =  $(element).find('p.tagline > time').attr('title');

                    let urlTemp =  $(element).find('li.first > a').attr('href');
                    let url = urlTemp.replace("old.reddit.com", "www.reddit.com");

                    let mediaUrl;

                    try {
                        mediaUrl = "https://" + ($(element).find('a.thumbnail.invisible-when-pinned > img').attr('src'));
                    } catch (UnhandledPromiseRejectionWarning) {
                        mediaUrl = "No media";
                    }

                    results.push({title: title,
                        author: author,
                        authorUrl: authorUrl,
                        score: score,
                        time: time,
                        url: url,
                        mediaUrl: mediaUrl})
                } else {
                    return false
                }
            })


        })

        return results

    }
}

// Exporting the module
module.exports = self;
