import React from 'react';

import MessageLog from './MessageLog';
import OnlineBox from './OnlineBox';
import MessageInput from './MessageInput';

import './ChatView.css';


function ChatView(props: {messages: Array<{author: string, text: string}>, active: Array<string>, inactive: Array<string>}) {
  return (
    <div id="chatView" className="tablet overlay margin-bottom gutter responsive" style={{display:'flex', flexDirection: 'column', height: '100%'}}>
        <MessageLog messages={props.messages} />
        <OnlineBox active={props.active} inactive={props.inactive} />
        <MessageInput />
    </div>
  );
}

export default ChatView;
