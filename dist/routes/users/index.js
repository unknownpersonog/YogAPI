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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const create_1 = __importDefault(require("./create"));
const verify_1 = __importDefault(require("./verify"));
const schemas_1 = require("../../database/schemas");
router.use('/create', create_1.default);
router.use('/verify', verify_1.default);
router.get('/info/:discordId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discordId = req.params.discordId;
        const user = yield schemas_1.DiscordAPI.findOne({ discordId });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    }
    catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).send('Internal Server Error');
    }
}));
exports.default = router;
