# message-channel-promise
Promise wrapper for communication via post message and MesssageChannel


## Installation
`npm i message-channel-promise`

## Usage
The module exposes a function which can be used to wrap communication via [MessageChannel](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API) in a promise, resolved only when the recepient responds.

This works with both IFrames and webworkers.

### parameters
* `target`: The `contentWindow` or worker,
* `message`: The message to send. Must be a serializable JSON object.
* `targetOrigin` (optional): The origin to send the message to. Defaults to `*`, and not necessary for web workers.
[You should always send a targetOrigin when working with iFrames](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns).

### Examples

Usage with IFrames:

```js
const sendChannelMessage =  require('message-channel-promise');
const frame = document.querySelector('#iframe');
const message = {/* ... */};
sendChannelMessage(frame.contentWindow, message, '*')
  .then(function(data) {
    // Do something with the response
  });
```

Usage with Web Workers:

```js
const sendChannelMessage =  require('message-channel-promise');
const worker = new Worker(someScript);
sendChannelMessage(worker, message)
    .then(function (data) {
      // Do something with the response
    });
```