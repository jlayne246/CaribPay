"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env_mod = exports.db_mod = exports.logger = void 0;
const tslib_1 = require("tslib");
// These lines import methods and objects from the utilities and config files into the starting point of the framework.
const logger_1 = tslib_1.__importDefault(require("./utils/logger"));
exports.logger = logger_1.default;
const db_mod = tslib_1.__importStar(require("./config/db"));
exports.db_mod = db_mod;
const env_mod = tslib_1.__importStar(require("./config/env"));
exports.env_mod = env_mod;
