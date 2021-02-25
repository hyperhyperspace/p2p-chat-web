// mesh.worker.ts
/// <reference lib="webworker" />

import { NetworkAgent, PeerGroupAgent, StateGossipAgent, TerminalOpsSyncAgent, WebRTCConnection, WebWorkerMeshHost } from '@hyper-hyper-space/core';
import { } from '@hyper-hyper-space/p2p-chat';

// log control:

StateGossipAgent.controlLog.level = 5;
StateGossipAgent.peerMessageLog.level = 5;

PeerGroupAgent.controlLog.level = 5;

TerminalOpsSyncAgent.controlLog.level = 5;

WebRTCConnection.logger.level = 5;
NetworkAgent.connLogger.level = 5;
NetworkAgent.messageLogger.level = 5;

// crate the mesh host, it will listen for messages on a broadcast channel,
// thus being effectivly controlled from the UI thread.

const webWorkerHost = new WebWorkerMeshHost();

export default null as any;