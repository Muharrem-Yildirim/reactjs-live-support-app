import React from 'react'
import { IconButton } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";

import locale from "../locales/main";

export default function ChatBottom({ messageInput, onInputChange, onKeyDown, onPressButton, message, isOnline }) {
    return (
        <div className="messages-bottom">
            <div className="message-textbox">
                <input
                    type="text"
                    name="message"
                    ref={messageInput}
                    placeholder={locale.enter_message}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    value={message}
                    disabled={!isOnline ? true : false}
                />
            </div>
            <IconButton
                aria-label=""
                className="message-send-button"
                onClick={onPressButton}
                disabled={
                    message.length === 0 || !isOnline

                }
            >
                <SendIcon />
            </IconButton>
        </div>
    )
}
