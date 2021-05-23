scrapper = require('../js/scrapper');
let config = require('../config/config.json')

test("", () => {
    expect(() => config.forEach(channel => {
        scrapper.initialize(channel, 1)
    })).not.toThrowError(SyntaxError);
})
