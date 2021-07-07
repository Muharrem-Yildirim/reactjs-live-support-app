import React from 'react'
import locale from "../locales/main";

export default function NoRowsFound() {
    return (
        <div className="no-rows-found">
            <div>{locale.no_rows_found}</div>
        </div>
    )
}
