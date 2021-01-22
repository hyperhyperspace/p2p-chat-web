import React, { useState } from 'react';

import MessageLog from './MessageLog';
//import OnlineBox from './OnlineBox';
import MessageInput from './MessageInput';

import './ChatView.css';
import { Identity, SpaceInit, Store } from '@hyper-hyper-space/core';
import { useStateObject, useSpace, usePeerResources } from '@hyper-hyper-space/react';
import { ChatRoom, ChatRoomConfig } from '@hyper-hyper-space/p2p-chat';

function ChatView(props: {init: SpaceInit, chatRoomConfig: ChatRoomConfig, chatRoomName: string}) {
  //const resources = usePeerResources();
  const entry = useSpace<ChatRoom>(props.init, true);
  //let topic = useStateObject(entry?.topic);
  //entry?.messages?.setResources(resources);
  const messages = useStateObject(entry?.messages)?.value;
  


  if (entry === undefined) {
    return (
      <div>connecting...</div>
    );
  } else {
      return (
        <div id="chatView" className="tablet overlay no-margins padding gutter responsive" style={{display:'flex', flexDirection: 'column', height: '100%'}}>
          <MessageLog messages={messages} />
          <MessageInput room={entry} chatRoomConfig={props.chatRoomConfig}/>
        </div>
      );
  }
}

/*
function ChatView(props: {messages: Array<{author: string, text: string}>, active: Array<string>, inactive: Array<string>}) {
  
  
  
  return (
    <div id="chatView" className="tablet overlay margin-bottom gutter responsive" style={{display:'flex', flexDirection: 'column', height: '100%'}}>
        <MessageLog messages={props.messages} />
        <OnlineBox active={props.active} inactive={props.inactive} />
        <MessageInput />
    </div>
  );
}

*/

export default ChatView;
