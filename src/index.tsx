import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatView from './ChatView';
import reportWebVitals from './reportWebVitals';

import { IdbBackend, Resources, StateGossipAgent, Store, ObjectDiscoveryAgent, MemoryBackend, PeerGroupAgent, TerminalOpsSyncAgent, WorkerSafeIdbBackend, WebRTCConnection, NetworkAgent } from '@hyper-hyper-space/core';
import { ChatRoomConfig } from '@hyper-hyper-space/p2p-chat';
import { PeerComponent } from '@hyper-hyper-space/react';

import { WebWorkerMeshProxy } from '@hyper-hyper-space/core';

import { Mesh } from '@hyper-hyper-space/core';

/* eslint-disable-next-line import/no-webpack-loader-syntax */
import WebWorker from 'worker-loader!./mesh.worker';
import App from './App';

//import { WebWorkerMesh } from '@hyper-hyper-space/webworker';

const main = async () => {

  // log control:

  ObjectDiscoveryAgent.log.level = 5;

  PeerGroupAgent.controlLog.level = 5;

  TerminalOpsSyncAgent.controlLog.level = 5;
  TerminalOpsSyncAgent.opTransferLog.level = 5;
  TerminalOpsSyncAgent.peerMessageLog.level = 5;
  StateGossipAgent.controlLog.level = 5;
  StateGossipAgent.peerMessageLog.level = 5;

  WebRTCConnection.logger.level = 5;

  NetworkAgent.connLogger.level = 5;
  NetworkAgent.messageLogger.level = 5;

  WebWorkerMeshProxy.webRTCLogger.level = 5;


  /*const chatStore = chatRoomConfig.archiveLocally?.getValue()?.value ? 
                      new Store(new IdbBackend(chatRoomName + '-store')) :
                      new Store(new MemoryBackend(chatRoomName + '-mem'));*/

  const backend = new WorkerSafeIdbBackend('chat-window-store-v9');
  let dbBackendError: (string|undefined) = undefined;


  try {
    console.log('Initializing storage backend...');
    await backend.ready();
    console.log('Storage backend ready');
  } catch (e: any) {
    dbBackendError = e.toString();
  }
  

  const chatStore = new Store(backend);





  const worker = new WebWorker();
  const webWorkerMesh = new WebWorkerMeshProxy(worker);

  await webWorkerMesh.ready; // The MeshHost in the web worker will send a message once it is fully
                             // operational. We don't want to send any control messages before that,
                             // so we'll wait here until we get the 'go' message from the MeshHost.

  console.log(new Mesh());
  const resources = await Resources.create({mesh: webWorkerMesh.getMesh(), store: chatStore});

  ReactDOM.render(
    <React.StrictMode>
      { dbBackendError === undefined && 
      <App resources={resources}/>
      }
      { dbBackendError !== undefined &&
      <div className="modal transparent black">
        <div className="card text-width margin-auto gutter">
            <h6 className="monospace no-margin-top padding-bottom text-trim big">
                Error initializing in-browser store
            </h6>
            <p className="monospace text-crunch small" >
              <a href="https://www.hyperhyperspace.org">Hyper Hyper Space</a> couldn't create a store in your browser. This could be caused 
              by running in <span className="red">incognito mode</span> in some browsers. Otherwise, you need to run 
              a browser that supports IndexedDb, like the latest <a href="https://www.mozilla.org/en-US/firefox/">Firefox</a>,&nbsp;
              <a href="https://www.google.com/chrome/">Chrome</a> or <a href="https://www.apple.com/safari/">Safari</a>.</p>
        </div>
      </div>
  
      }
    </React.StrictMode>,

    document.getElementById('root')
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);

main();