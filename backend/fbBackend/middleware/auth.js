const express = require('express');
const {
    signUpUser, confirmUser, signInUser, signOutUser,
} = require('../auth/auth');

const router = express.Router();




// POST /auth/signup  { email, password }
router.post('/signup', async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const result = await signUpUser({email, password});

        res.status(201).json({
            userConfirmed: result.UserConfirmed,
            userSub: result.UserSub,
            message: 'Signup successful, check email for verification code (if enabled).',
        });
    } catch (err) {
        next(err);
    }
});

// POST /auth/confirm  { email, code }
router.post('/confirm', async (req, res, next) => {
    try {
        const {email, code} = req.body;

        await confirmUser({email, code});

        res.json({message: 'User confirmed successfully.'});
    } catch (err) {
        next(err);
    }
});

// POST /auth/login  { email, password }
router.post('/login', async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const auth = await signInUser({email, password});

        res.json({
            accessToken: auth.AccessToken,
            idToken: auth.IdToken,
            refreshToken: auth.RefreshToken,
            expiresIn: auth.ExpiresIn,
            tokenType: auth.TokenType,
        });
    } catch (err) {
        next(err);
    }
});

// POST /auth/logout  (Authorization: Bearer <accessToken>)
router.post('/logout', async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const [, token] = authHeader.split(' ');

        if (!token) {
            return res.status(401).json({error: 'Access token required'});
        }

        await signOutUser({accessToken: token});

        res.json({message: 'Logged out (global sign-out) successfully.'});
    } catch (err) {
        next(err);
    }
});

module.exports = router;
