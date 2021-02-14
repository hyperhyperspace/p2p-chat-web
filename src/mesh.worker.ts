// mesh.worker.ts
/// <reference lib="webworker" />

import { PeerGroupAgent, WebWorkerMeshHost } from '@hyper-hyper-space/core';
import { } from '@hyper-hyper-space/p2p-chat';

PeerGroupAgent.controlLog.level = 5;

const webWorkerHost = new WebWorkerMeshHost();

export default null as any;