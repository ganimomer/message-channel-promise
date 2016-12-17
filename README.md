# message-channel-promise
Promise wrapper for communication via post message and MesssageChannel


## Installation
`npm i message-channel-promise`

## Usage
The module exposes a function which can be used to wrap communication via MessageChannel in a promise, resolved only when the recepient responds.

This works with both iframes and webworkers.

### parameters
* `target`: The `contentWindow` or worker,
* `message`: The message to send. Must be a serializable JSON object.
* `targetOrigin` (optional): The origin to send the message to. Defaults to `*`, and not necessary for web workers.
[You should always send a targetOrigin when working with iFrames](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns).
### Examples

For example:

```js
const sendChannelMessage =  require('message-channel-promise');
const frame = document.querySelector('#iframe');
const message = {/* ... */};
sendChannelMessage(frame.contentWindow, message, '*');
```
