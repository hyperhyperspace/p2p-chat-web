import { HashedLiteral, HashedObject, MutableReference, Resources, Space, LoadResults, WordCode } from '@hyper-hyper-space/core';
import { ChatRoom } from '@hyper-hyper-space/p2p-chat';
import React, { useEffect, useRef, useState } from 'react';

function ChatHeader(props: {showWelcome?: boolean, room?: ChatRoom | undefined, resources: Resources, lookupChat: () => void}) {

    // Current chat state

    const currentTopic = props.room?.topic?.getValue()?.value as string;

    // Create chat dialog state

    const nameInput = useRef<HTMLInputElement>(null);

    const [currentName, setCurrentName] = useState('');
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentName(event.target.value);
    };
    const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            doCreateChatRoom();
        }
    }

    const [createDialogShown, setCreateDialogShown] = useState(false);

    const [newRoom, setNewRoom] = useState<ChatRoom|undefined>(undefined);


    const createChatRoom = () => {
        const room = new ChatRoom();
        setNewRoom(room);
    };

    const showCreateChatRoomDialog = () => {
        setCurrentName('');
        setCreateDialogShown(true); 
        createChatRoom();
    };

    const doCreateChatRoom = async () => {

        newRoom?.topic?.setValue(new HashedLiteral(currentName));
        await props.resources.store.save(newRoom as HashedObject);
        const space = Space.fromEntryPoint(newRoom as ChatRoom, props.resources);
        setCreateDialogShown(false);
        window.location.hash = '#/room/en/' + Space.getWordCodingFor(await space.entryPoint).join('-');
        props.lookupChat();
    };
    
    const cancelCreateChatRoom = () => {
        setNewRoom(undefined);
        setCreateDialogShown(false);
    };


    useEffect(() => {
        if (createDialogShown) {
            nameInput.current?.focus();
        }
    }, [createDialogShown]);



    const [lookupDialogShown, setLookupDialogShown] = useState(false);

    const [localChatRooms, setLocalChatRooms] = useState<Array<[string, Array<string>]>|undefined>(undefined);

    const showLookupDialog = () => {
        setCurrentWord1('');
        setCurrentWord2('');
        setCurrentWord3('');
        setLocalChatRooms(undefined);
        setLookupDialogShown(true);
    }

    const closeLookupDialog = () => {
        setLookupDialogShown(false);
    }

    const word1Input = useRef<HTMLInputElement>(null);
    const word2Input = useRef<HTMLInputElement>(null);
    const word3Input = useRef<HTMLInputElement>(null);

    const [currentWord1, setCurrentWord1] = useState('');
    const [currentWord2, setCurrentWord2] = useState('');
    const [currentWord3, setCurrentWord3] = useState('');

    const handleWord1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentWord1(event.target.value);
    };

    const handleWord1KeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            word2Input.current?.focus();
        }
    }

    const handleWord2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentWord2(event.target.value);
    };
    const handleWord2KeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            word3Input.current?.focus();
        }
    }

    const handleWord3Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentWord3(event.target.value);
    };
    const handleWord3KeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            doLookupChatRoom();
        }
    }

    const doLookupChatRoom = () => {

        if (currentWord1 === '' || currentWord2 === '' || currentWord3 === '') {
            window.alert('Please complete the 3 code words in the black boxes an try again.')
        } else {
            setLookupDialogShown(false);
            window.location.hash = '#/room/en/' + currentWord1 + '-' + currentWord2 + '-' + currentWord3;
            props.lookupChat();    
        }
    }

    const doLoadLocalChatRoom = () => {
        if (selectedLocalChatRoom.length === 0) {
            window.alert('Please choose a chat room from the list.')
        } else {
            setLookupDialogShown(false);
            window.location.hash = '#/room/en/' + selectedLocalChatRoom;
            props.lookupChat();    
        }
    }

    const [selectedLocalChatRoom, setSelectedLocalChatRoom] = useState<string>('');

    const handleLocalChatRoomSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocalChatRoom(event.target.value);
    };

    const loadLocalChatRooms = async () => {
        const loaded  = await props.resources.store.loadByClass(ChatRoom.className);
        const options = new Array<[string, Array<string>]>();

        for (const chatRoom of (loaded.objects as Array<ChatRoom>)) {
            const topicRef = chatRoom.topic;

            let topic = '';

            if (topicRef !== undefined) {
                await topicRef.loadAllChanges();
                const lastTopic = topicRef.getValue()?.value;
                if (lastTopic !== undefined) {
                    topic = lastTopic;
                }
            }

            const option: [string, string[]] = [topic, Space.getWordCodingFor(chatRoom)];
            options.push(option);
        }

        options.sort((a: [string, string[]],b: [string, string[]]) => a[0].localeCompare(b[0]));

        setLocalChatRooms(options);
    };

    useEffect(() => {
        if (lookupDialogShown) {
            loadLocalChatRooms();
            word1Input.current?.focus();
        }
    }, [lookupDialogShown]);

    const [renameDialogShown, setRenameDialogShown] = useState(false);

    const renameInput = useRef<HTMLInputElement>(null);

    const showRenameDialog = () => {
        setCurrentRename(currentTopic);
        setRenameDialogShown(true);
    }

    useEffect(() => {
        if (renameDialogShown) {
            renameInput.current?.focus();
        }
    });

    const [currentRename, setCurrentRename] = useState('');
    const handleRenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentRename(event.target.value);
    };
    const handleRenameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            doRename();
        }
    }

    const doRename = async () => {
        await props.room?.topic?.setValue(new HashedLiteral(currentRename));
        await props.room?.topic?.saveQueuedOps();
        setRenameDialogShown(false);
    };

    const cancelRename = () => {
        setRenameDialogShown(false);
    }

    const [shareDialogShown, setShareDialogShown] = useState(false);

    const showShareDialog = () => {
        setShareDialogShown(true);
    };

    const closeShareDialog = () => {
        setShareDialogShown(false);
    };

    const shareInput = useRef<HTMLInputElement>(null);

    const wordCoding = props.room === undefined? ['', '', ''] : Space.getWordCodingFor(props.room);

    const copyToClipboard = () => {
        if (shareInput.current !== null) {
            shareInput.current.select();
            document.execCommand('copy');
        }
    }

    const [embedDialogShown, setEmbedDialogShown] = useState(false);

    const embedTextArea = useRef<HTMLTextAreaElement>(null);
    

    const showEmbedDialog = () => {
        setEmbedDialogShown(true);
    };

    const closeEmbedDialog = () => {
        setEmbedDialogShown(false);
    };

    const copyEmbedToClipboard = () => {
        if (embedTextArea.current !== null) {
            embedTextArea.current.select();
            document.execCommand('copy');
        }
    };

    const wordCodeTag = wordCoding.join('-');

    const embedHTML =   "<iframe id=\"" + wordCodeTag +"\"\n" + 
                        "        width=\"100%\"\n" +
                        "        height=\"100%\"\n" +
                        "        src=\"https://hyperhyper.space/chat-window/?" + wordCodeTag + "#/en/" + wordCodeTag + "\">\n" +
                        "</iframe>\n";

    
    return  <React.Fragment>
                <div className="grid border monospace text-padding dark primary">
                    { props.room !== undefined &&
                    <div className="grid-width-nine">
                        <span>{currentTopic}</span>
                        <button onClick={showRenameDialog} className="margin-left blue dim dark cool info text-crunch small monospace">Rename</button> <button onClick={showEmbedDialog} className="blue dim dark cool text-crunch small monospace">Embed</button> <button onClick={showShareDialog} className="dark cool success text-crunch small monospace">Share</button>
                    </div>
                    }{ props.room === undefined &&
                        <div className="grid-width-nine">
                        </div>
                        }
                    <div className="grid-width-three text-right">
                        <button onClick={showLookupDialog} className="blue dim dark cool text-crunch small monospace">Open chat</button> <button onClick={showCreateChatRoomDialog} className="dark cool red dim dark text-crunch small monospace">Create new</button>
                    </div>
                    
                </div>
                { createDialogShown && 
                <div className="modal transparent black">
                    <div className="card text-width margin-auto gutter">
                        <h6 className="monospace no-margin-top padding-bottom text-trim big">
                            Create a new room
                        </h6>
                            <span className="monospace" >Chat room title:</span>
                            <input ref={nameInput} className="light white monospace" value={currentName} onChange={handleNameChange} onKeyPress={handleNameKeyPress} style={{width: '100%', textAlign: 'center'}} type="text"></input>
                            
                            {newRoom !== undefined && 
                                    <React.Fragment>
                                    <div className="margin no-margin-left no-margin-right no-margin-bottom">
                                        <span className="monospace">3-word code:</span>
                                        <div className="grid">
                                            <div className="grid-width-nine text-center dark cool black text-padding small monospace">{Space.getWordCodingFor(newRoom).join(' ')}</div>
                                            <div className="grid-width-three"><button onClick={createChatRoom} className="monospace dim white">Shuffle</button></div>
                                            
                                        </div>
                                        <div className="monospace text-padding text-center text-color light gray small">used by others to look up your room</div>
                                    </div>

                                    <div className="gutter-top text-center padding-top">
                                        <button onClick={doCreateChatRoom} className="dark dim success margin-right monospace" >Create</button>
                                        &nbsp;&nbsp;&nbsp;
                                        <button onClick={cancelCreateChatRoom} className="monospace dim dark white">Cancel</button>
                                    </div>
                                </React.Fragment>
                            }

                           {newRoom === undefined &&
                            <div className="text-center">
                                <div className="dark cool black text-crunch small padding monospace">Creating chat room code...</div>
                            </div>
                           } 
                        
                    </div>
                </div>
                }
                { lookupDialogShown &&
                <div className="modal transparent black">
                    <div className="card text-width margin-auto gutter">
                        <h6 className="monospace no-margin-top padding-bottom text-trim big">
                            Find a room
                        </h6>
                            <span className="monospace" >Find by 3-word code:</span>
                            <div className="grid">
                                <div className="grid-width-four"><input ref={word1Input} className="black monospace" value={currentWord1} onChange={handleWord1Change} onKeyPress={handleWord1KeyPress} style={{width: '100%', textAlign: 'center'}} type="text"></input></div>
                                <div className="grid-width-four"><input ref={word2Input} className="black monospace" value={currentWord2} onChange={handleWord2Change} onKeyPress={handleWord2KeyPress} style={{width: '100%', textAlign: 'center'}} type="text"></input></div>
                                <div className="grid-width-four"><input ref={word3Input} className="black monospace" value={currentWord3} onChange={handleWord3Change} onKeyPress={handleWord3KeyPress} style={{width: '100%', textAlign: 'center'}} type="text"></input></div>
                            </div>
                            <div className="text-center padding-top">
                                <button onClick={doLookupChatRoom} className="dark dim success">Lookup</button>
                            </div>
                        { localChatRooms !== undefined && localChatRooms.length > 0 &&
                        <div className="gutter-top">
                                <span className="monospace" >Or choose one you've already visited:</span>
                                
                                <div className="grid">
                                    <div className="grid-width-ten">
                                        <select onChange={handleLocalChatRoomSelect} className="monospace" style={{width: '100%'}}>
                                            <option value=""></option>
                                            {localChatRooms.map((o: [string, string[]]) => (
                                                <option key={'load-option-' + o[1].join('-')} value={o[1].join('-')} className="monospace">{(o[0].length === 0? '' : o[0] + ' | ') + '[' + o[1].join(' ') + ']'}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid-width-two">
                                        <button onClick={doLoadLocalChatRoom} className="dark dim blue">Open</button>
                                    </div>
                                </div>
                        </div>
                        }
                        <div className="gutter-top text-center">
                            <button onClick={closeLookupDialog} className="monospace dim dark white">Go back</button>
                        </div>
                    </div>
                </div>
                }
                { renameDialogShown &&
                <div className="modal transparent black">
                    <div className="card text-width margin-auto gutter">
                        <h6 className="monospace no-margin-top padding-bottom text-trim big">
                            Rename room
                        </h6>
                        <div className="margins">
                            <input ref={renameInput} size={35} className="light white monospace" value={currentRename} onChange={handleRenameChange} onKeyPress={handleRenameKeyPress} style={{width: '100%', textAlign: 'center'}} type="text"></input>  
                        </div>
                        <div className="text-center gutter-top">
                            <button onClick={doRename} className="dark dim success margin-right monospace" >Rename</button>
                            &nbsp;&nbsp;&nbsp;
                            <button onClick={cancelRename} className="monospace dim dark white">Cancel</button>
                        </div>
                    </div>
                </div>
                }
                { shareDialogShown &&
                <div className="modal transparent black">
                    <div className="card text-width margin-auto gutter">
                        <h6 className="monospace no-margin-top padding-bottom text-trim big">
                            Share room with others
                        </h6>
                        
                        <span className="monospace text-crunch small">Just send the link:</span>
                            <div>
                        <input ref={shareInput} type="text" className="monospace small border white padding" value={window.location.href} style={{width:'100%'}}/>
                        </div>
                        <div className="text-center gutter-bottom margin-top">
                            <button onClick={copyToClipboard} className="dark dim success margin-right monospace">Copy to clipboard</button>
                        </div>

                        <span className="monospace text-crunch small">Or a Hyper Hyper Space 3-word code:</span>
                        
                        <div className="grid card-width margin-auto margin-top">
                            <div className="grid-width-four"><div className="black monospace text-padding" style={{width: '100%', textAlign: 'center'}}>{wordCoding[0]}</div></div>
                            <div className="grid-width-four"><div className="black monospace text-padding" style={{width: '100%', textAlign: 'center'}}>{wordCoding[1]}</div></div>
                            <div className="grid-width-four"><div className="black monospace text-padding" style={{width: '100%', textAlign: 'center'}}>{wordCoding[2]}</div></div>
                        </div>

                        <div className="gutter-top text-center">
                            <button onClick={closeShareDialog} className="monospace dim dark white">Go back</button>
                        </div>
                    </div>
                </div>
                }
                { embedDialogShown &&
                <div className="modal transparent black">
                    <div className="card text-width margin-auto gutter">
                        <h6 className="monospace no-margin-top padding-bottom text-trim big">
                            Embed room in another website
                        </h6>
                        
                        <span className="monospace text-crunch small">Include this in your website's source:</span>
                            <div>
                        <textarea ref={embedTextArea} className="monospace small border white padding" value={embedHTML} style={{width:'100%'}}/>
                        </div>

                        <div className="text-center gutter-top">
                            <button onClick={copyEmbedToClipboard} className="dark dim success margin-right monospace" >Copy to clipboard</button>
                            &nbsp;&nbsp;&nbsp;
                            <button onClick={closeEmbedDialog} className="monospace dim dark white">Go back</button>
                        </div>
                    </div>
                </div>
                }
                { props.showWelcome &&
                    <div className="card text-width margin-auto gutter">
                        <h6 className="monospace no-margin-top padding-bottom text-trim big">
                            Chat in Hyper Hyper Space
                        </h6>
                        <p className="monospace text-crunch small">
                            This simple chat system is backed by <a href="https://www.hyperhyperspace.org">Hyper Hyper Space</a>'s 
                            peer to peer data layer. It is hosted here as a static website, that you can copy to other domains or
                            host locally in your computer. There is no server-side state.
                        </p>

                        <p className="monospace text-crunch small">
                            The chat rooms you participate in are replicated to your browser's storage, and synchronized automatically
                            with the browsers of other folks in the room. To join a room, at least one person must have it open at 
                            the time.
                        </p>

                        <p className="monospace text-crunch small">
                            Have any questions? Join us in the <a href="https://hyperhyper.space/chat-window/#/room/en/suburb-suburb-awake">Hyper Hyper Space Lounge</a>.
                        </p>

                        <div className="text-center gutter-top">
                            <button onClick={showLookupDialog} className="monospace dim dark white" >Join chat room</button>
                            &nbsp;&nbsp;&nbsp;
                            <button onClick={showCreateChatRoomDialog} className="dark dim success margin-right monospace">Create new chat</button>
                        </div>
                    </div>
                }
            </React.Fragment>

}

export default ChatHeader;