import { Resources } from '@hyper-hyper-space/core';
import { ChatRoomConfig } from '@hyper-hyper-space/p2p-chat';
import { PeerComponent } from '@hyper-hyper-space/react';
import { useEffect, useState } from 'react';

import ChatView from './ChatView';


function App(props: {resources: Resources}) {

    const [wordCodeLang, setWordCodeLang]     = useState<string|undefined>(undefined);
    const [wordCode, setWordCode]             = useState<string[]|undefined>(undefined);
    const [chatRoomConfig, setChatRoomConfig] = useState<ChatRoomConfig | undefined>();
  
    const loadChatConfig = async (newWordCode: string[], newWordCodeLang: string) => {
        //const wordCode = ['eggplant', 'erosion', 'absolute'];
        const newChatRoomConfig = new ChatRoomConfig(newWordCode, newWordCodeLang);

        await props.resources.store.save(newChatRoomConfig); // this will bind it to the store
        
        // the following two should be unnecessary after the next hhs-core release:
        newChatRoomConfig.authorIdentity?.setStore(props.resources.store);
        newChatRoomConfig.archiveLocally?.setStore(props.resources.store);

        await newChatRoomConfig.authorIdentity?.loadAllChanges();
        await newChatRoomConfig.archiveLocally?.loadAllChanges();
        
        setChatRoomConfig(newChatRoomConfig);
    }

    const lookupChat = () => {

        console.log('lookupchat')
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
        } else {
            if (wordCodeLang !== undefined || wordCode !== undefined) {
                window.location.hash = '';
                setWordCodeLang(undefined);
                setWordCode(undefined);    
            }
        }
    }
  
    useEffect(() => {
        lookupChat();
    });
    
    window.onpopstate = lookupChat;

    const init = wordCode === undefined || wordCodeLang === undefined?
                    undefined
                : 
                    {wordCode: wordCode, wordCodeLang: wordCodeLang};

    return  <PeerComponent resources={props.resources}>
                <ChatView chatRoomConfig={chatRoomConfig} init={init} lookupChat={lookupChat} resources={props.resources}/>
            </PeerComponent>;
}

export default App;