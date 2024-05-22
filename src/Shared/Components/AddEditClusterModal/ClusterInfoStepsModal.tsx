import { useState } from 'react'
import Tippy from '@tippyjs/react'
import { ReactComponent as Help } from '../../../Assets/Icon/ic-help.svg'
import './cluster.scss'
import { ReactComponent as ClipboardIcon } from '../../../Assets/Icon/ic-copy.svg'
import { copyToClipboard } from '../../../Common'
import { ClusterStepModalProps } from './types'

const ClusterInfoSteps = ({ command, clusterName }: ClusterStepModalProps) => {
    const [copied, setCopied] = useState(false)
    const copyClipboard = (e): void => {
        e.stopPropagation()
        setCopied(true)
        copyToClipboard(command)
    }
    const infoItems = [
        {
            additionalInfo: (
                <div>
                    <span className="fw-6">Prerequisites:</span> kubectl should be installed
                </div>
            ),
        },
        {
            info: 'Run below command on terminal to get server URI & bearer token',
            additionalInfo: (
                <div className="dc__position-rel cluster-modal-container dc__align-left bcn-1 lh-20 mt-2 br-4">
                    <div
                        className="fs-13 fw-4 h-100 dc__overflow-scroll dc__ff-monospace pl-10 pt-10 pb-10 pr-36"
                        id="command-code"
                    >
                        {command}
                    </div>
                    <Tippy
                        className="default-tt p-4"
                        arrow={false}
                        placement="bottom"
                        content={copied ? 'Copied!' : 'Copy'}
                        trigger="mouseenter click"
                        onShow={(_tippy) => {
                            setTimeout(() => {
                                _tippy.hide()
                                setCopied(false)
                            }, 5000)
                        }}
                        interactive
                    >
                        <div className="cluster-clipboard dc__position-abs cursor" onClick={copyClipboard}>
                            <ClipboardIcon className="icon-dim-16" />
                        </div>
                    </Tippy>
                </div>
            ),
        },
        {
            info: 'Copy & paste Server URL & Bearer token from command output',
        },
        {
            info: `Replace Local IP with public IP at which ${clusterName} cluster api server is accessible`,
        },
    ]

    return (
        <div className="p-12 fs-13 fw-4">
            {infoItems.map((item, key) => (
                <div className="cluster-modal-wrapper ">
                    <div className="cluster-modal-number flex mr-16 bw-1 bcn-0 en-2 icon-dim-24">{key + 1}</div>
                    <div className="cluster-inner-container flexbox-col dc__border-left pt-2 pr-44 pb-20 pl-28 lh-20 dc__align-start dc__content-start">
                        {item.info && <div>{item.info}</div>}
                        {item.additionalInfo && item.additionalInfo}
                    </div>
                </div>
            ))}
        </div>
    )
}

const ClusterInfoStepsModal = ({ subTitle, command, clusterName }: ClusterStepModalProps) => (
    <div className="fs-13 fw-4 br-4 en-2 bcn-0 cluster-modal-shadow">
        <h2 className="flex left fs-14 fw-6 p-12 m-0">
            <Help className="icon-dim-20 fcv-5 mr-12" />
            Get Server URL & Bearer token
        </h2>
        {subTitle && <p className="bcn-1 pt-8 pb-8 pl-12 pr-12 m-0">{subTitle}</p>}
        <ClusterInfoSteps subTitle={subTitle} command={command} clusterName={clusterName} />
        <div className="p-12">
            {/* TODO: ADD URL */}
            <a href="docs" target="_blank" rel="noreferrer">
                View documentation
            </a>
        </div>
    </div>
)

export default ClusterInfoStepsModal
