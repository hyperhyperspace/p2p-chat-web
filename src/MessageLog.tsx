
//TODO use hash of msg for key

function MessageLog(props: {messages: Array<{author: string, text: string}>}) {
    
    return (
        <div className="dark cool black text-margin-bottom overflow-scroll" style={{height: '70%'}}>
            <div className="serif no-margins padding responsive ">
                {props.messages.map((msg:{author: string, text: string}) => (
                    <p key={msg.author+' '+msg.text}><strong>{msg.author}:</strong> {msg.text}</p>
                ))}
            </div>
        </div>
    );
}

export default MessageLog;