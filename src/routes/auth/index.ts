import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/discord', passport.authenticate('discord'), (req, res) => 
    res.sendStatus(200)
);

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => 
    res.send({ msg: 'Success' })
);

router.get('/status', (req, res) => {
    return req.user 
        ? res.send({ msg: 'User is logged in!'}) 
        : res.status(401).send({
            msg:'Unauthorized'
        });
});

export default router;