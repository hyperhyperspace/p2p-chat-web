import React from 'react';
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
import WebWorker from 'worker-loader!./mesh.worker'

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


  const location = window.location.hash.substr(2);
  const [wordCodeLang, words] = location.split('/');
  const wordCode = words !== undefined? words.split('-') : undefined;

  const chatConfigStore = new Store(new IdbBackend('chat-config'));
  //const wordCode = ['eggplant', 'erosion', 'absolute'];
  const chatRoomConfig = new ChatRoomConfig(wordCode, wordCodeLang);

  await chatConfigStore.save(chatRoomConfig); // this will bind it to the store
  
  // the following two should be unnecessary after the next hhs-core release:
  chatRoomConfig.authorIdentity?.setStore(chatConfigStore);
  chatRoomConfig.archiveLocally?.setStore(chatConfigStore);

  await chatRoomConfig.authorIdentity?.loadAllChanges();
  await chatRoomConfig.archiveLocally?.loadAllChanges();

  const chatRoomName = wordCode !== undefined? wordCode.join('-') + '/' + wordCodeLang : undefined;

  /*const chatStore = chatRoomConfig.archiveLocally?.getValue()?.value ? 
                      new Store(new IdbBackend(chatRoomName + '-store')) :
                      new Store(new MemoryBackend(chatRoomName + '-mem'));*/

  const chatStore = new Store(new WorkerSafeIdbBackend(chatRoomName + '-store'));

  const authorId = chatRoomConfig.authorIdentity?.getValue();

  console.log(authorId);


  const worker = new WebWorker();
  const webWorkerMesh = new WebWorkerMeshProxy(worker);

  await webWorkerMesh.ready; // The MeshHost in the web worker will send a message once it is fully
                             // operational. We don't want to send any control messages before that,
                             // so we'll wait here until we get the 'go' message from the MeshHost.

  console.log(new Mesh());
  const resources = new Resources({mesh: webWorkerMesh.getMesh(), store: chatStore, config: {id: authorId}});

  ReactDOM.render(
    <React.StrictMode>
      <PeerComponent resources={resources}>
        { chatRoomName && 
          <ChatView chatRoomName={chatRoomName} chatRoomConfig={chatRoomConfig} init={{wordCode: wordCode, wordCodeLang: wordCodeLang}} />
        }
        { !chatRoomName && 
          <div> No chat room name specified, use the format #/en/acre-cliff-busy </div>
        }
      </PeerComponent>
    </React.StrictMode>,

    document.getElementById('root')
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);

main();