import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ChatView from './ChatView';
import reportWebVitals from './reportWebVitals';

const chat = [['new2css', "okay but what if"],
              ['new2css', "i never use the inner-text-width class?"],
              ['new2css', "but my CSS still has it?"],
              ['tenfourover', "it's fine. it'll be fine."],
              ['new2css', "but it's wasted bandwidth"]]

const props = {messages: chat.map((m:Array<string>) => ({author: m[0], text: m[1] })),
              active: ['new2css', 'tenfourover'],
              inactive: ['byzan10', 'johnnee']}


ReactDOM.render(
  <React.StrictMode>
    <ChatView {...props} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
