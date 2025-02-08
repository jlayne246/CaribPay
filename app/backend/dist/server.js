"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const framework_1 = require("framework");
const PORT = process.env.PORT || 5000;
mongoose_1.default.connect('mongodb://localhost:27017/caribpay-db')
    .then(() => {
    console.log("Connected to MongoDB");
    app_1.default.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}/api`);
        framework_1.logger.info("");
    });
})
    .catch((err) => console.error('DB Connection Error: ', err));
