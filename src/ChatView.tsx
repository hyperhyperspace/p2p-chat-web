import React, { useState } from 'react';

import MessageLog from './MessageLog';
//import OnlineBox from './OnlineBox';
import MessageInput from './MessageInput';

import './ChatView.css';
import { Identity, Resources, SpaceInit, Store } from '@hyper-hyper-space/core';
import { useStateObject, useSpace, usePeerResources } from '@hyper-hyper-space/react';
import { ChatRoom, ChatRoomConfig } from '@hyper-hyper-space/p2p-chat';
import ChatHeader from './ChatHeader';

function ChatView(props: {init?: SpaceInit, chatRoomConfig?: ChatRoomConfig, lookupChat: () => void, resources: Resources}) {
  //const resources = usePeerResources();
  const entry = useSpace<ChatRoom>(props.init, true);
  //let topic = useStateObject(entry?.topic);
  //entry?.messages?.setResources(resources);
  const messages = useStateObject(entry?.messages)?.value;
  const topic    = useStateObject(entry?.topic)?.value;
  

  const ready = entry !== undefined && props.chatRoomConfig !== undefined;

  let isIframe: boolean;

  try {
      isIframe = window.top !== window.self;
  } catch (e) {
      isIframe = true;
  }

  return (
    <div id="chatView" className="black starfield inner-gutter" style={{display:'flex', flexDirection: 'column', height: '100%'}}>
      
      { !isIframe &&
      <ChatHeader showWelcome={props.init === undefined} room={entry} lookupChat={props.lookupChat} resources={props.resources} />
      }
      {props.init !== undefined  &&
        
      
      <React.Fragment>
        {entry === undefined &&
            <div>connecting...</div>        
        }
        {entry !== undefined &&
          <React.Fragment>
            <MessageLog messages={messages} chatRoomConfig={props.chatRoomConfig as ChatRoomConfig} />
            <MessageInput room={entry} chatRoomConfig={props.chatRoomConfig}/>
          </React.Fragment>
        }
        
      </React.Fragment>
      }
      
    </div>
  );
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
