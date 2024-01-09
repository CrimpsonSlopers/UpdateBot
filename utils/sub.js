
async function subscribeToEvent() {
    try {
        const tokenResponse = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`, {
            method: 'POST',
        });

        const tokenData = await tokenResponse.json();

        const subscriptionResponse = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + tokenData.access_token,
                'Client-Id': 'amx9ywcjrmq4rklh8g21vy6pqhjpo0',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'type': 'channel.update',
                'version': '2',
                'condition': {
                    'broadcaster_user_id': process.env.USER_ID,
                },
                'transport': {
                    'method': 'webhook',
                    'callback': `${process.env.SERVER_URL}/eventsub`,
                    'secret': 's3cre77890ab'
                }
            })
        });

        const subscriptionData = await subscriptionResponse.json();
        console.log(subscriptionData);
    } catch (err) {
        console.error(err);
    }
}


