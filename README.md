# A p2p web-based chat client using Hyper Hyper Space.

This simple chat client can be hosted as a static website, and works fully p2p. It can be embedded into other websites using an IFrame, for example.

It uses WebRTC leveraging [Hyper Hyper Space](https://github.com/hyperhyperspace/hyperhyperspace-core)'s shared data layer, [React](https://reactjs.org) and [Cavepaint CSS](https://cavepaint.github.io/cavepaintcss/).

You can join Hyper Hyper Space's example chat using the following fragment:

/#/en/acre-cliff-busy

I will host this somewhere so it can be used online. Until then, you can do

```
yarn start
```

and then navigate to http://localhost:3000/#/en/acre-cliff-busy

The three words on the right of the URL encode a partial hash for a chat room. Creating a new chat room is still not supported on the web UI (soon!), but you can create chat rooms using the [command line version](https://github.com/hyperhyperspace/p2p-chat-cli) and then join on your browser.

