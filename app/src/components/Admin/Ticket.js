import React from 'react'
import { Grid, IconButton, Button } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

import locale from "../../locales/main";

export default function Ticket({ element, idx, onClickShowInfo, onClickClaimTicket, onClickCloseTicket }) {
    return (
        <Grid className="chat">
            <div className="details">
                <div className="title">
                    {element.informationData.fullName}
                </div>
                <div className="message">
                    {element.informationData.message}
                </div>
            </div>
            <div style={{ flexGrow: 1 }} />
            <IconButton
                onClick={(e) => { onClickShowInfo(e, idx) }}

            >
                <InfoIcon />
            </IconButton>
            <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 5 }}
                onClick={(e) => { onClickClaimTicket(e, element.roomName) }}

                disabled={element.isClaimed ? true : false}
            >
                {locale.claim.toLocaleUpperCase()}
            </Button>
            <Button
                variant="contained"
                color="secondary"
                style={{ marginLeft: 5 }}
                onClick={(e) => { onClickCloseTicket(e, element.roomName) }}
            >

                {locale.close.toLocaleUpperCase()}
            </Button>
        </Grid>
    )
}
