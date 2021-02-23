// mesh.worker.ts
/// <reference lib="webworker" />

import { PeerGroupAgent, StateGossipAgent, WebWorkerMeshHost } from '@hyper-hyper-space/core';
import { } from '@hyper-hyper-space/p2p-chat';

StateGossipAgent.controlLog.level = 1;
StateGossipAgent.peerMessageLog.level = 1;

PeerGroupAgent.controlLog.level = 5;

const webWorkerHost = new WebWorkerMeshHost();

export default null as any;