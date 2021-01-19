import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatView from './ChatView';
import reportWebVitals from './reportWebVitals';

import { IdbBackend, Resources, StateGossipAgent, Store, ObjectDiscoveryAgent, MemoryBackend } from '@hyper-hyper-space/core';
import { ChatRoomConfig } from '@hyper-hyper-space/p2p-chat';
import PeerComponent from './PeerComponent';

/*const chat = [['new2css', "okay but what if"],
              ['new2css', "i never use the inner-text-width class?"],
              ['new2css', "but my CSS still has it?"],
              ['tenfourover', "it's fine. it'll be fine."],
              ['new2css', "but it's wasted bandwidth"]]

const props = {messages: chat.map((m:Array<string>) => ({author: m[0], text: m[1] })),
              active: ['new2css', 'tenfourover'],
              inactive: ['byzan10', 'johnnee']}*/


const main = async () => {
  let defaultResources: Resources = new Resources();

  console.log(defaultResources);

  console.log(ObjectDiscoveryAgent.log.level);

  ObjectDiscoveryAgent.log.level = 5;
  StateGossipAgent.controlLog.level = 5;
  StateGossipAgent.peerMessageLog.level = 5;

  console.log(ObjectDiscoveryAgent.log.level);


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

  const chatStore = chatRoomConfig.archiveLocally?.getValue()?.value ? 
                      new Store(new IdbBackend(chatRoomName + '-store')) :
                      new Store(new MemoryBackend(chatRoomName + '-mem'));

  const authorId = chatRoomConfig.authorIdentity?.getValue();

  console.log(authorId);

  const resources = new Resources({store: chatStore, config: {id: authorId}});

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
reportWebVitals(console.log);

main();