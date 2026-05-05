/*****\
* GUI *
\*****/
const notifyButton = document.querySelector("#enableNotifications");
notifyButton.addEventListener("click", () => {
  // first check if permission already granted
  if (Notification.permission == "granted") {
    testNotification("Evergreen Notifications Enabled", "You will receive task reminders for your plants!");
    return;
  }

  // if not granted yet, request permission from the user
  Notification.requestPermission().then((permission) => {
    console.log(permission); // for debugging
    if (permission == "granted") {
        testNotification("Evergreen Notifications", "You will now receive task reminders for your plants!");
    }
  });
});

// testNotification function
// This function is an example of using the Notification API to display a notification from anywhere in our code.
// This is independent from the push notifications.
function testNotification(titleText, bodyText) {
  const options = {
    body: bodyText,
    icon: `/static/images/icon-192x192.png`,
  };
  new Notification(titleText, options);
}

const btnSubscribe = document.querySelector("#subscribe");
btnSubscribe.addEventListener('click', (event) => {
  // Send the subscription details to the server
  // We're sending the userId to identify the subscription
  subscribeToPush(localStorage.getItem('userId'));
});

/********************\
* PUSH NOTIFICATIONS *
\********************/
const PUSH_PUBLIC_KEY = 'BDci0SieARu-rH-pBj6KoA0r9-eSyRNE3JyuZBN-NleoMm3HnnQbdWmMZGwiWnsp0LbwxRGLtuIsBPS9tn8bVsg';

function subscribeToPush(userId) {
  if (!navigator.serviceWorker) { // are SWs supported?
    return;
  }
  navigator.serviceWorker.ready.then(registration => {
  // Code to obtain a subscription to push notifications

  // use the PushManager to get user's subscription to the push service
  return registration.pushManager.getSubscription()
    .then(existingSubscription => { // if we are already subscribed, returns existing
        // if a subscription was found, return it
        if (existingSubscription) {
            return existingSubscription;
        }
        // otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
        // send notifications that don't have a visible effect for the user)
        // applicationServerKey is the server's public key
        return registration.pushManager.subscribe({
            userVisibleOnly: true, //Our push notifications will be visible to the user
            applicationServerKey: PUSH_PUBLIC_KEY
        });
    });
  })
  .then(subscription => {
    // Code to send the subscription to the server
    // now we have a subscription, let's send it to the server
    console.log("subscribing to push notifications: ", subscription);

    // send the subscription details to the server
    fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId, // the userId to identify the subscription
            subscription: subscription // subscription object for this client
            // we send this to PushRoutes.js -> see pushRouter.post('/subscribe').. etc where we do pushSubscriptions[req.body.userId]..
        }),
    })
    .then(res => {
      if (!res.ok) throw new Error(`Subscribe failed: ${res.status}`);
      console.log('Push subscription saved successfully');
    })
    .catch(error => {
      console.error('Failed to save subscription to server: ', error);
    });
  })
  .catch(error => {
    console.error('Failed to subscribe the user: ', error);
  });
}
