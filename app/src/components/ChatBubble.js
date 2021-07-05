import React from 'react'

import AutoLinkText from "react-autolink-text2";
import { Grid, IconButton } from "@material-ui/core";

import locale from "../locales/main";

export default function ChatBubble({ element, idx, lastAlign }) {


    return (
        <Grid
            item
            className={
                "message " + (element.align === "right" ? "right" : "left")
            }
        // style={{
        //     display: element.message === "how_can_i_help" ||
        //         element.message === "interviews_are_recorded" ? "none" : ""
        // }}
        >
            <div
                className="message-image"
                style={
                    idx > 0
                        ? lastAlign ===
                            element.align
                            ? { opacity: 0 }
                            : {}
                        : {}
                }
            >
                {element.isSupporter ? (
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/1024px-User_icon_2.svg.png"
                        alt="support profile"
                    />
                ) : (
                    <img
                        src="https://www.w3schools.com/howto/img_avatar.png"
                        alt="user profile"
                    />
                )}
            </div>
            <div
                className="message-bubble fade-in"
                style={
                    idx > 0
                        ? lastAlign ===
                            element.align
                            ? { borderRadius: 20 }
                            : {}
                        : {}
                }
            >
                <div className="message-inside">
                    <span className="message-text">
                        <AutoLinkText
                            text={element.sender === 9999 ? locale[element.message] : element.message}
                            disableUrlStripping={true}
                        />
                    </span>
                    <span className="message-time">{element.time}</span>
                </div>
            </div>
        </Grid>
    )
}
