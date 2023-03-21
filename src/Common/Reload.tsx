import React from 'react'
import loadingFailure from '../Assets/Img/ic-loading-failure.png'
import { ReloadType } from './Types'

export default function Reload({ reload, className = '' }: ReloadType) {
    function refresh(e) {
        window.location.reload()
    }
    return (
        <article className={`flex w-100 h-100 ${className}`}>
            <div className="flex column w-250 dc__align-center">
                <img src={loadingFailure} style={{ height: 'auto' }} className="w-100 mb-12" alt="load-error" />
                <h3 className="title dc__bold">Failed to load</h3>
                <div className="dc__empty__subtitle mb-20">
                    We could not load this page. Please give us another try.
                </div>
                <button type="button" className="cta ghosted" onClick={typeof reload === 'function' ? reload : refresh}>
                    Retry
                </button>
            </div>
        </article>
    )
}
