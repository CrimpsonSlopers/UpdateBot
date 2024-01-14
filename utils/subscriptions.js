require("dotenv").config();

const subscriptions = {
    "stream.online": {
        "type": "stream.online",
        "version": "1",
        "condition": {
            "broadcaster_user_id": process.env.BROADCASTER_ID
        },
        "transport": {
            "method": "webhook",
            "callback": process.env.EVENTSUB_CALLBACK,
            "secret": process.env.CLIENT_SECRET
        }
    },
    "stream.offline": {
        "type": "stream.offline",
        "version": "1",
        "condition": {
            "broadcaster_user_id": process.env.BROADCASTER_ID
        },
        "transport": {
            "method": "webhook",
            "callback": process.env.EVENTSUB_CALLBACK,
            "secret": process.env.CLIENT_SECRET
        }
    },
    'channel.update': {
        'type': 'channel.update',
        'version': '2',
        'condition': {
            'broadcaster_user_id': process.env.BROADCASTER_ID,
        },
        'transport': {
            'method': 'webhook',
            'callback': process.env.EVENTSUB_CALLBACK,
            'secret': process.env.CLIENT_SECRET
        }
    }
}

module.exports = {
    subscriptions,
}
