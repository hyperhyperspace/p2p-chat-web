
function MessageInput() {
    return (
        <div className="">
            <div className="grid grid-gap-text-padding no-margin-bottom">
                <input type="text" className="grid-width-nine monospace" />
                <button className="grid-width-three bright action">Send</button>
            </div>
        </div>
    );
}

export default MessageInput;