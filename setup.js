require('dotenv').config();
const { subscriptions } = require("./utils/subscriptions")

async function getAccessToken() {
    try {
        const tokenResponse = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`, {
            method: 'POST',
        });

        const tokenData = await tokenResponse.json();
        return tokenData.access_token;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function subscribeToEvent() {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Client-Id': process.env.CLIENT_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscriptions['channel.update'])
        });

        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

async function listOfSubscriptions() {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Client-Id': process.env.CLIENT_ID,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}


async function deleteSubscription(id) {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions?id=' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Client-Id': process.env.CLIENT_ID,
            }
        });

        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    subscribeToEvent,
    listOfSubscriptions,
    deleteSubscription,
}
