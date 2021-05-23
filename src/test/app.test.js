app = require("../js/app");
let config = require("../config/config.json");

test('Config exists', ()=> {
    expect(() => require('../config/config.json')).not.toThrowError('Cannot find module \'../config/config.json\' from \'src/test/app.test.js\'')
})

test("Config file is not empty", () => {
    expect(() => config).not.toBe("[]");
})