import { Resources } from '@hyper-hyper-space/core';
import { ChatRoomConfig } from '@hyper-hyper-space/p2p-chat';
import { PeerComponent } from '@hyper-hyper-space/react';
import { useState } from 'react';

import ChatView from './ChatView';


function App(props: {resources: Resources}) {

    const [wordCodeLang, setWordCodeLang]     = useState<string|undefined>(undefined);
    const [wordCode, setWordCode]             = useState<string[]|undefined>(undefined);
    const [chatRoomConfig, setChatRoomConfig] = useState<ChatRoomConfig | undefined>();
  
    const loadChatConfig = async (newWordCode: string[], newWordCodeLang: string) => {
        //const wordCode = ['eggplant', 'erosion', 'absolute'];
        const newChatRoomConfig = new ChatRoomConfig(newWordCode, newWordCodeLang);

        console.log('TRULALA')
        console.log(newChatRoomConfig.authorIdentity)
        console.log(wordCode);


        await props.resources.store.save(newChatRoomConfig); // this will bind it to the store
        
        // the following two should be unnecessary after the next hhs-core release:
        newChatRoomConfig.authorIdentity?.setStore(props.resources.store);
        newChatRoomConfig.archiveLocally?.setStore(props.resources.store);

        await newChatRoomConfig.authorIdentity?.loadAllChanges();
        await newChatRoomConfig.archiveLocally?.loadAllChanges();
        
        setChatRoomConfig(newChatRoomConfig);
    }

    const lookupChat = () => {
        const location = window.location.hash.substr(2);

        const parts = location.split('/');

        console.log(parts)

        if (parts[0] === 'room') {

            const newWordCodeLang = parts[1];
            const newWords        = parts[2];

            const newWordCode = newWords !== undefined? newWords.split('-') : undefined;
  
            if (newWordCodeLang != wordCodeLang || newWordCode?.join('-') !== wordCode?.join('-')) {
                setWordCodeLang(newWordCodeLang);
                setWordCode(newWordCode);
    
                loadChatConfig(newWordCode as string[], newWordCodeLang);
            }
        }
    }
  
    lookupChat();

    const chatRoomName = wordCode !== undefined? wordCode.join('-') + '/' + wordCodeLang : undefined;

    return  <PeerComponent resources={props.resources}>
                { (chatRoomName && chatRoomConfig) &&
                        <ChatView chatRoomName={chatRoomName} chatRoomConfig={chatRoomConfig} init={{wordCode: wordCode, wordCodeLang: wordCodeLang}} lookupChat={lookupChat} resources={props.resources}/>
                }
                { (chatRoomName && !chatRoomConfig) &&
                    <div> Loading configuration for  {chatRoomName}</div>
                }
                { !chatRoomName && 
                 <div> No chat room name specified, use the format #/en/acre-cliff-busy </div>
                }
            </PeerComponent>;
}

export default App;