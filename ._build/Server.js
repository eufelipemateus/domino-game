"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const App_1 = require("./App");
dotenv.config();
const port = process.env.PORT;
App_1.default.debug = process.env.DEBUG;
App_1.default.server.listen(port, function () {
    console.info(`Server running in  http://localhost:${port}...`);
});
