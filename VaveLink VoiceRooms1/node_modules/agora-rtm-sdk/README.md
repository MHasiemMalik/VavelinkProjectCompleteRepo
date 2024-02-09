# [Agora Signaling SDK](https://docs-beta.agora.io/en/signaling/overview/product-overview) 

Agora Signaling provides low-latency, high-concurrency signaling and synchronization capabilities for real-time systems. Agora’s Signaling SDK enables developers to apply low-latency event notifications and real-time changes to user, device, and channel attributes in applications. Signaling can be used to enhance the experience for Voice Calling, Video Calling, and Interactive Live Steaming.

## Features

- **Message channels** - Real-time messaging that enables asynchronous pub-sum message transmission without the need for immediate response. Publishers send messages to the channel, subscribers receive messages from the channels they sign up to. Depending on your business needs, send string or binary payloads

- **Stream channels** - A real-time data pipeline that enables the uninterrupted flow of data from one point to another without delay or latency. Depending on your business needs, send string or binary payloads

- **Topics** - Facilitate effective data stream management and communication between users in real time in Stream channels. Enable users to subscribe to, distribute, and notify users subscribed to a topic. Publishers send messages to a topic, subscribers receive messages in the topics they sign up to.

- **Presence** - In online collaboration apps, enable users to see the availability of their contacts. Presence information is typically displayed as a status message or with an icon next to a user's name. It helps users determine the availability of others for communication or collaboration.

- **Storage** - Persist and managing data that is exchanged between different clients or devices in real-time. Ensure that messages are not lost or dropped during transmission and enable quick and reliable message delivery to any number of clients.

- **Lock** - Critical resource management mechanism to prevent mutual interference. Ensure that messages are processed in a specific order and prevent concurrent access to the same data. When your app accesses a resource, it can lock on that resource to prevent other clients from accessing it.

With Signaling you can build chat, in-game chat, collaborations apps and more.

## Prerequisites

- A supported browser
- Node LTS & Npm
- An Agora account and project
- A computer with Internet access

**Contact support@agora.io and enable Signaling v2.x for your project.**

## Install

Install the Signaling SDK using npm:

```bash
npm install agora-rtm-sdk
```

## [Initialize](https://docs-beta.agora.io/en/signaling/get-started/get-started-sdk)

```ts
// Import the SDK
import AgoraRTM from 'agora-rtm-sdk';

// Create a client instance 
const signalingEngine = new AgoraRTM.RTM('app-id', 'user-id', { token: 'temporary-token' });

// Listen for events
signalingEngine.addEventListener('message', (eventArgs) => {
  console.log(`${eventArgs.publisher}: ${eventArgs.message}`);
})

// Login 
try { 
  await signalingEngine.login(); 
} catch (err) {
  console.log({ err }, 'error occurs at login.');
}

// Send channel message
try { 
  await signalingEngine.publish('channel', 'hello world');
} catch (err) {
  console.log({ err }, 'error occurs at publish message');
}

```

## Support

For any support related questions, head to [our support page](http://agora-ticket.agora.io) to get assistance.
