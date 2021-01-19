import { HashedObject, Identity, RSAKeyPair } from '@hyper-hyper-space/core';
import { ChatRoom, ChatRoomConfig } from '@hyper-hyper-space/p2p-chat';
import { useState } from 'react';
import { usePeerResources, useStateObject } from './hhs-react-hooks';

function MessageInput(props: {room: ChatRoom, chatRoomConfig?: ChatRoomConfig}) {

    const resources = usePeerResources();

    const [currentText, setCurrentText] = useState('');
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentText(event.target.value);
    };

    const [currentName, setCurrentName] = useState('');
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentName(event.target.value);
    };

    const room = useStateObject(props.room);
    
    const authorReference = useStateObject(props.chatRoomConfig?.authorIdentity);

    const [joinModalShown, setJoinModalShown] = useState(false);
    const [creatingUser, setCreatingUser] = useState(false);

    const doJoin = async () => {

        setCreatingUser(true);

        await new Promise(r => setTimeout(r, 100));

        let kp: RSAKeyPair = await new Promise<RSAKeyPair>((r) => r(RSAKeyPair.generate(2048)));

        let id = Identity.fromKeyPair({name: currentName}, kp);

        await resources.store.save(kp.clone());
        await resources.store.save(id.clone());

        props.chatRoomConfig?.authorIdentity?.setValue(id);
        await props.chatRoomConfig?.authorIdentity?.saveQueuedOps();

        setJoinModalShown(false);

        doSendMessage(await resources.store.load(id.hash()));
    }

    const doCancel = () => {
        setJoinModalShown(false);
    }

    const doSendMessage = (id?: Identity) => {
        let author = id;

        if (author === undefined) {
            author = authorReference?.value?.getValue();
        }

        if (room !== undefined) {

            if (author === undefined) {
                setJoinModalShown(true);
            } else {
                room.value?.say(author, currentText);
                setCurrentText('');
            }
        }
    }

    const sendMessage = () => {

        doSendMessage();

    }

    return (
        <div className="padding-top padding-bottom">
            {authorReference?.value?.getValue() === undefined && joinModalShown && 
                <div className="modal transparent black">
                    <div className="card margin-auto gutter">
                        <h6 className="monospace no-margin-top padding-bottom text-trim big">
                            Join the conversation
                        </h6>
                        <form>
                            <span className="monospace" >Your name:</span>
                            <input className="light white monospace" value={currentName} onChange={handleNameChange} style={{width: '100%', textAlign: 'center'}}type="text"></input>
                            
                            {!creatingUser && 
                                <div className="text-center padding-top">
                                    <button onClick={doJoin} className="bright action margin-right monospace" >&nbsp;&nbsp;OK&nbsp;&nbsp;</button>
                                    <button onClick={doCancel} className="monospace">Cancel</button>
                                </div>
                            }
                           {creatingUser &&
                            <div className="padding-top text-center">
                                <div className="dark cool black text-crunch small padding monospace">Please hold on whle your computer joins Hyper Hyper Space, {currentName}.</div>
                            </div>
                           } 
                        </form>
                    </div>
                </div>
            }
            <div className="grid grid-gap-text-padding no-margin-bottom">
                <input type="text" value={currentText} onChange={handleTextChange} className="grid-width-nine monospace" />
                <button onClick={sendMessage} className="grid-width-three bright action monospace">Send</button>
            </div>
        </div>
    );
}

export default MessageInput;