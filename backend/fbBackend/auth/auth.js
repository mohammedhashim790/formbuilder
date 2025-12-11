const {
    CognitoIdentityProviderClient,
    SignUpCommand,
    ConfirmSignUpCommand,
    InitiateAuthCommand,
    GlobalSignOutCommand,
    AdminConfirmSignUpCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});

const UserPoolId = process.env.COGNITO_USER_POOL_ID;
const ClientId = process.env.COGNITO_CLIENT_ID;

async function signUpUser({email, password}) {
    const cmd = new SignUpCommand({
        ClientId, Username: email, Password: password, UserAttributes: [{Name: 'email', Value: email}],
    });
    const res = await client.send(cmd);
    await client.send(new AdminConfirmSignUpCommand({
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

    const out = await client.send(cmd);
    return out;
}

module.exports = {
    signUpUser, confirmUser, signInUser, signOutUser,
};
