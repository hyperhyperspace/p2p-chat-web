import { Identity } from '@hyper-hyper-space/core';
import { ChatRoom } from '@hyper-hyper-space/p2p-chat';
import { useState } from 'react';
import { usePeerResources, useStateObject } from './hhs-react-hooks';

function MessageInput(props: {room: ChatRoom}) {

    const resources = usePeerResources();

    const [currentText, setCurrentText] = useState('');
    const room = useStateObject(props.room);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentText(event.target.value);
    };

    const sendMessage = () => {
        
        if (room !== undefined) {
            room.value?.say(resources.config.id as Identity, currentText);
            setCurrentText('');
        }

    }

    return (
        <div className="">
            <div className="grid grid-gap-text-padding no-margin-bottom">
                <input type="text" value={currentText} onChange={handleChange} className="grid-width-nine monospace" />
                <button onClick={sendMessage} className="grid-width-three bright action">Send</button>
            </div>
        </div>
    );
}

export default MessageInput;