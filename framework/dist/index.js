"use strict";
// export {default as logger} from './utils/logger';
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.initialiseFramework = initialiseFramework;
const tslib_1 = require("tslib");
// import {logger} from './index';
const logger_1 = tslib_1.__importDefault(require("./utils/logger"));
exports.logger = logger_1.default;
logger_1.default.info("Framework building.");
function initialiseFramework() {
    console.log('Framework Initialised!');
    logger_1.default.info("Framework initialised.");
}
