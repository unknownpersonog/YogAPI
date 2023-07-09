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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schemas_1 = require("../../../database/schemas");
const router = (0, express_1.Router)();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discordId = req.body.discordId;
        const email = req.body.email;
        const vps = req.body.vps;
        if (!discordId || !email) {
            return res.status(400).send('Invalid Request Body!');
        }
        const existingUser = yield schemas_1.DiscordAPI.findOne({ discordId });
        if (existingUser) {
            return res.status(409).send('User already exists');
        }
        const newUser = new schemas_1.DiscordAPI({
            email,
            discordId,
            vps: [{ id: 'N/A' }]
        });
        yield newUser.save();
        res.status(200).send('User created successfully');
    }
    catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
}));
exports.default = router;
