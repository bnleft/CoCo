"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var discord_js_1 = __importDefault(require("discord.js"));
var server_1 = require("./server");
var help_1 = __importDefault(require("./modules/help"));
var info_1 = __importDefault(require("./modules/info"));
var reaction_role_1 = __importDefault(require("./modules/reaction-role"));
var stonks_1 = __importDefault(require("./modules/stonks"));
// Configuration
require('dotenv').config();
var token = process.env.TOKEN;
var prefix = process.env.PREFIX || 'coco-';
// Defining bot
var client = new discord_js_1["default"].Client({
    intents: [
        discord_js_1["default"].Intents.FLAGS.GUILDS,
        discord_js_1["default"].Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1["default"].Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION'
    ],
});
// Creating collection of command modules
var modules = new discord_js_1["default"].Collection();
InitializeModule(help_1["default"]);
InitializeModule(info_1["default"]);
InitializeModule(reaction_role_1["default"]);
InitializeModule(stonks_1["default"]);
// Bot start
client.on('ready', function () {
    var _a;
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity("with people", { type: "PLAYING" });
    console.log('CoCo is online.');
});
// Message handling
client.on('messageCreate', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var welcomeChannel, ran, args, command, commandHandler;
    var _a, _b;
    return __generator(this, function (_c) {
        welcomeChannel = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find(function (c) { return c.name === 'welcome'; });
        if (welcomeChannel && message.channelId === welcomeChannel.id) {
            ran = Math.floor((Math.random() * 10) + 1);
            if (ran === 1)
                message.channel.send("I lost my life savings from dogecoin now go read #rules");
            else if (ran === 2)
                message.channel.send("I bet you won't read #rules");
            else if (ran === 3)
                message.channel.send("Read #rules if you want rough brain");
        }
        if (!message.content.startsWith(prefix) || message.author.bot)
            return [2 /*return*/];
        args = message.content.slice(prefix.length).split(/ +/);
        command = (_b = args.shift()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        if (!command)
            return [2 /*return*/];
        commandHandler = modules.get(command);
        // Abort when the command is undefined
        if (!commandHandler)
            return [2 /*return*/];
        // All commands use this interface
        if (commandHandler.command)
            commandHandler.command(message, args, client, modules);
        return [2 /*return*/];
    });
}); });
// Host server
(0, server_1.keepAlive)();
// Login with token
client.login(token)["catch"](function () {
});
function InitializeModule(module) {
    modules.set(module.name, module);
    if (module.service)
        module.service(client);
}
//# sourceMappingURL=index.js.map