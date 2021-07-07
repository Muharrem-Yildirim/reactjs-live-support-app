import React from 'react'
import locale from "../../locales/main";

export default function NoSupportRequest() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginTop: 10,
                fontFamily: "Open Sans",
                fontWeight: "bold",
                padding: 10,
            }}
        >
            {locale.no_support_request}
        </div>
    )
}
