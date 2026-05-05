const express = require('express');
const pushRouter = express.Router();
const webpush = require('web-push');

pushRouter.use(express.json());

// remove this later once you see VAPID KEYS and put them into .env file
// const vapidKeys = webpush.generateVAPIDKeys();
// console.log(vapidKeys); 

const vapidKeys = {
  publicKey: process.env.PUSH_PUBLIC_KEY,
  privateKey: process.env.PUSH_PRIVATE_KEY
};

webpush.setVapidDetails(process.env.PUSH_SERVER_ID, vapidKeys.publicKey, vapidKeys.privateKey);
const pushSubscriptions = {}; // stores subscriptions keyed by userId

// POST /subscribe - for storing user's push subscription
pushRouter.post('/subscribe', (req, res) => {
  console.log('Push subscription received:', req.body);
  pushSubscriptions[req.body.userId] = req.body.subscription;
  res.status(201).json({});
});

// Helper function to send push notifications
// keys are the userIds of the users that have subscribed to push notifications
function sendPush(userId, plantName, task) {
  for (const subscribedUserId in pushSubscriptions) { // code to send a push notf. to user
    if (!subscribedUserId || subscribedUserId !== String(userId)) {
        continue;
    }
    const subscription = pushSubscriptions[subscribedUserId];
    // sending push notification
    webpush.sendNotification(subscription, JSON.stringify({
        title: `Task Reminder: ${task}`, // notification title
        body: `Reminder for ${plantName}: ${task}` // body of notification
    }))
    .then(result => {
      console.log("Sent push to: ", subscribedUserId);
    })
    .catch(error => {
      console.log("Failed to sending push for: ", subscribedUserId, error);
    });
  }
}

module.exports = pushRouter;
module.exports.sendPush = sendPush;