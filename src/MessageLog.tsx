
import { MutableSet } from '@hyper-hyper-space/core';
import { ChatMessage, ChatRoomConfig } from '@hyper-hyper-space/p2p-chat';
import { useEffect, useRef } from 'react';

function MessageLog(props: {messages?: MutableSet<ChatMessage>, chatRoomConfig: ChatRoomConfig}) {

    const divRef    = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        let isIframe: boolean;

        try {
            isIframe = window.top !== window.self;
        } catch (e) {
            isIframe = true;
        }

        if (!isIframe) {
            divRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else {
            if (divRef.current !== null && scrollRef.current !== null) {
                scrollRef.current.scrollTo(0, divRef.current.offsetTop);
            }
        }
    });

    if (props.messages === undefined) {
        return <div>loading...</div>;
    } else {
        return (
            <div ref={scrollRef} className="dark cool black text-margin-bottom overflow-scroll" style={{height: '99%'}}>
                <div className="monospace no-margins padding responsive ">
                    {Array.from(props.messages.values()).sort((a: ChatMessage, b: ChatMessage) => a.timestamp as number - (b.timestamp as number)).map((msg:ChatMessage) => (
                        <p key={msg.getLastHash()}><strong>{msg.getAuthor()?.info?.name}:</strong> {msg.text}</p>
                    ))}
                </div>
                <div ref={divRef}></div>
            </div>
        );
    }
}

export default MessageLog;