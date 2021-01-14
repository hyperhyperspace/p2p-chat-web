
//TODO use hash of msg for key

import { MutableSet } from "@hyper-hyper-space/core";
import { ChatMessage } from "@hyper-hyper-space/p2p-chat";

function MessageLog(props: {messages?: MutableSet<ChatMessage>}) {
    
    if (props.messages === undefined) {
        return <div>loading...</div>;
    } else {
        return (
            <div className="dark cool black text-margin-bottom overflow-scroll" style={{height: '70%'}}>
                <div className="serif no-margins padding responsive ">
                    {Array.from(props.messages.values()).map((msg:ChatMessage) => (
                        <p key={msg.hash()}><strong>{msg.getAuthor()?.info?.name}:</strong> {msg.text}</p>
                    ))}
                </div>
            </div>
        );
    }
}

/*function MessageLog(props: {messages: Array<{author: string, text: string}>}) {
    
    return (
        <div className="dark cool black text-margin-bottom overflow-scroll" style={{height: '70%'}}>
            <div className="serif no-margins padding responsive ">
                {props.messages.map((msg:{author: string, text: string}) => (
                    <p key={msg.author+' '+msg.text}><strong>{msg.author}:</strong> {msg.text}</p>
                ))}
            </div>
        </div>
    );
}*/

export default MessageLog;