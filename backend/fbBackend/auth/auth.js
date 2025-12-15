const {
    CognitoIdentityProviderClient,
    SignUpCommand,
    ConfirmSignUpCommand,
    InitiateAuthCommand,
    GlobalSignOutCommand,
    AdminConfirmSignUpCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const {CognitoJwtVerifier} = require('aws-jwt-verify');


const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION, credentials: {
        accessKeyId: process.env.ACCESS_TOKEN, secretAccessKey: process.env.SECRET_TOKEN
    }
});

const UserPoolId = process.env.COGNITO_USER_POOL_ID;
const ClientId = process.env.COGNITO_CLIENT_ID;


const verifier = CognitoJwtVerifier.create({
    userPoolId: UserPoolId, clientId: ClientId, tokenUse: 'access',
});


async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        const [scheme, token] = authHeader.split(' ');

        if (scheme !== 'Bearer' || !token) {
            return new Error("Missing or invalid Authorization header");
        }

        const payload = await verifier.verify(token);
        req.headers['user_id'] = payload.sub;

    } catch (err) {
        console.error('Auth error:', err);
        // return res.status(401).json({error: 'Invalid or expired token'});
    } finally {
        // temporary
        next();

    }
}

async function signUpUser({email, password}) {
    const cmd = new SignUpCommand({
        ClientId, Username: email, Password: password, UserAttributes: [{Name: 'email', Value: email}],
    });
    const res = await client.send(cmd);
    const res1 = await client.send(new AdminConfirmSignUpCommand({
        UserPoolId, Username: email,
    }))
    return res;

}

async function confirmUser({email, code}) {
    const cmd = new ConfirmSignUpCommand({
        ClientId, Username: email, ConfirmationCode: code,
    });

    return await client.send(cmd);
}

async function signInUser({email, password}) {
    const cmd = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH', ClientId, AuthParameters: {
            USERNAME: email, PASSWORD: password,
        },
    });

    const out = await client.send(cmd);
    return out.AuthenticationResult; // { AccessToken, IdToken, RefreshToken, ... }
}

async function signOutUser({accessToken}) {
    const cmd = new GlobalSignOutCommand({
        AccessToken: accessToken,
    });

    return await client.send(cmd);
}

module.exports = {
    signUpUser, confirmUser, signInUser, signOutUser, auth
};
