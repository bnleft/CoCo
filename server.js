"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.keepAlive = void 0;
var express_1 = __importDefault(require("express"));
var server = (0, express_1["default"])();
server.all('/', function (req, res) {
    res.send('CoCo online.');
});
function keepAlive() {
    server.listen(3000, function () {
        console.log('Server online.');
    });
}
exports.keepAlive = keepAlive;
//# sourceMappingURL=server.js.map