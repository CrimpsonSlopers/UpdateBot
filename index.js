require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const { EmbedBuilder, WebhookClient } = require('discord.js');

const webhookClient = new WebhookClient({ id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN });

const app = express();
const port = 8080;

const breakingNewsPhrases = [
    "Stop the presses, we've got a sizzling hot scoop!",
    "Hold onto your hats, folks, we've just unearthed a jaw-dropping revelation!",
    "Attention! We interrupt your regularly scheduled programming for some earth-shattering news!",
    "Extra, extra! Read all about it! A bombshell has just dropped!",
    "Alert! We've got a game-changing story that'll knock your socks off!",
    "Newsflash! Prepare for a mind-blowing revelation coming your way!",
    "Brace yourselves! We're about to drop a bombshell that'll rattle your world!",
    "Urgent bulletin! We're on the brink of announcing a groundbreaking discovery!",
    "Hold your breath! We're about to spill some top-secret, headline-making information!",
    "Calling all attention! Prepare for a colossal news revelation that will send shockwaves!"
];


// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

var RUNNING_TITLE = "MORE LETHAL THAN EVER???"


app.use(express.raw({
    type: 'application/json'
}))

app.get('/', (req, res) => {
    res.send('This is a test route. Your server is up and running!');
});


app.post('/eventsub', (req, res) => {
    let message = getHmacMessage(req);
    let hmac = 'sha256=' + getHmac(process.env.CLIENT_SECRET, message);

    if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
        let notification = JSON.parse(req.body);

        if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
            console.log(`Event type: ${notification.subscription.type}`);
            console.log(JSON.stringify(notification.event, null, 4));

            if (notification.subscription.type == "channel.update") {
                if (notification.event.title != RUNNING_TITLE) {
                    RUNNING_TITLE = notification.event.title;
                    sendTitleUpdateMessage(notification.event)
                }
            }

            res.sendStatus(204);
        }
        else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
            res.set('Content-Type', 'text/plain').status(200).send(notification.challenge);
        }
        else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
            res.sendStatus(204);

            console.log(`${notification.subscription.type} notifications revoked!`);
            console.log(`reason: ${notification.subscription.status}`);
            console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
        }
        else {
            res.sendStatus(204);
            console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
        }
    }
    else {
        console.log('403');
        res.sendStatus(403);
    }

})

app.listen(port, () => {
    console.log(`App listening at ${process.env.SERVER_URL}:${port}`);
})

// Build the message used to get the HMAC.
function getHmacMessage(request) {
    return (request.headers[TWITCH_MESSAGE_ID] +
        request.headers[TWITCH_MESSAGE_TIMESTAMP] +
        request.body);
}

// Get the HMAC.
function getHmac(secret, message) {
    return crypto.createHmac('sha256', secret)
        .update(message)
        .digest('hex');
}

// Verify whether our hash matches the hash that Twitch passed in the header.
function verifyMessage(hmac, verifySignature) {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}

function sendTitleUpdateMessage(data) {
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`${data.title}`)
        .addFields(
            { name: 'Category', value: data.category_name },
            { name: 'Changed', value: `<t:${Math.floor(Date.now() / 1000)}:R>` },
        )
        .setThumbnail("https://static-cdn.jtvnw.net/jtv_user_pictures/cdc00955-e56b-437a-9347-52b50dc6a90c-profile_image-70x70.png")
        .setURL('https://www.twitch.tv/itsbigwilly_')


    var num = Math.floor(Math.random() * 10);
    webhookClient.send({
        content: `<@&${process.env.ROLE_ID}>\n${breakingNewsPhrases[num]}`,
        username: 'BIgWilly Title Tracker',
        avatarURL: 'https://i.imgur.com/Afhttps://static-cdn.jtvnw.net/jtv_user_pictures/cdc00955-e56b-437a-9347-52b50dc6a90c-profile_image-70x70.pngFp7pu.png',
        embeds: [embed],
    });
}