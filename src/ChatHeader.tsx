import { HashedLiteral, HashedObject, MutableReference, Resources, Space, SpaceEntryPoint } from "@hyper-hyper-space/core";
import { ChatRoom } from "@hyper-hyper-space/p2p-chat";
import React, { useRef, useState } from "react";

function ChatHeader(props: {topic?: MutableReference<HashedLiteral> | undefined, resources: Resources, lookupChat: () => void}) {

    // Current chat state

    const currentTopic = props.topic?.getValue()?.value as string;

    // Create chat dialog state

    const nameInput = useRef<HTMLInputElement>(null);

    const [currentName, setCurrentName] = useState('');
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentName(event.target.value);
        createChatRoom();
    };

    const [createDialogShown, setCreateDialogShown] = useState(false);

    
    const [newRoom, setNewRoom] = useState<ChatRoom|undefined>(undefined);


    const createChatRoom = async () => {
        const room = new ChatRoom(currentName);
        setNewRoom(room);
    };

    const showCreateChatRoomDialog = () => {
        setCurrentName('');
        setCreateDialogShown(true); 
        createChatRoom();
    };

    const doCreateChatRoom = () => {

        const space = Space.fromEntryPoint(newRoom as ChatRoom, props.resources);

        space.entryPoint.then((entry: (HashedObject & SpaceEntryPoint)) => {
            window.location.hash = '#/room/en/' + Space.getWordCodingFor(entry).join('-');
            props.lookupChat();
        });
    };
    
    const cancelCreateChatRoom = () => {
        setNewRoom(undefined);
        setCreateDialogShown(false);
    };


    return  <React.Fragment>
                <div className="grid border monospace text-padding dark primary">
                    <div className="grid-width-nine">
                        <span>{currentTopic}</span>
                        <button className="margin-left blue dim dark cool info text-crunch small monospace">Rename</button> <button className="blue dim dark cool text-crunch small monospace">Embed</button> <button className="dark cool success text-crunch small monospace">Share</button>
                    </div>
                    <div className="grid-width-three text-right">
                        <button className="blue dim dark cool text-crunch small monospace">Lookup chat</button> <button onClick={showCreateChatRoomDialog} className="dark cool red dim dark text-crunch small monospace">Create new</button>
                    </div>
                </div>
                { createDialogShown && 
                <div className="modal transparent black">
                    <div className="card text-width margin-auto gutter">
                        <h6 className="monospace no-margin-top padding-bottom text-trim big">
                            Create a new room
                        </h6>
                        <form>
                            <span className="monospace" >Chat room title:</span>
                            <input ref={nameInput} className="light white monospace" value={currentName} onChange={handleNameChange} style={{width: '100%', textAlign: 'center'}} type="text"></input>
                            
                            {newRoom !== undefined && 
                                    <React.Fragment>
                                    <div className="margin no-margin-left no-margin-right no-margin-bottom">
                                        <span className="monospace">3-word code:</span>
                                        <div className="grid">
                                            <div className="grid-width-nine text-center dark cool black text-padding small monospace">{Space.getWordCodingFor(newRoom).join(' ')}</div>
                                            <div className="grid-width-three"><button onClick={createChatRoom} className="monospace dim white">Shuffle</button></div>
                                            
                                        </div>
                                        <div className="monospace text-padding text-center text-color light gray small">used to look up your chat room</div>
                                    </div>

                                    <div className="gutter-top text-center padding-top">
                                        <button onClick={doCreateChatRoom} className="big dark dim success margin-right monospace" >Create</button>
                                        &nbsp;&nbsp;&nbsp;
                                        <button onClick={cancelCreateChatRoom} className="big monospace dim dark white">Cancel</button>
                                    </div>
                                </React.Fragment>
                            }

                           {newRoom === undefined &&
                            <div className="text-center">
                                <div className="dark cool black text-crunch small padding monospace">Creating chat room code...</div>
                            </div>
                           } 
                        </form>
                    </div>
                </div>
            }
            </React.Fragment>

}

export default ChatHeader;