import { HelpOptionType } from './types'
import { ReactComponent as Chat } from '../../../Assets/Icon/ic-chat-circle-dots.svg'
import { ReactComponent as EditFile } from '../../../Assets/Icon/ic-edit-file.svg'
import { ReactComponent as Files } from '../../../Assets/Icon/ic-files.svg'
import { DISCORD_LINK } from '../../../Common'

const OPEN_NEW_TICKET = 'https://enterprise.devtron.ai/portal/en/newticket'
const VIEW_ALL_TICKETS = 'https://enterprise.devtron.ai/portal/en/myarea'
const RAISE_ISSUE = 'https://github.com/devtron-labs/devtron/issues/new/choose'

export const EnterpriseHelpOptions: HelpOptionType[] = [
    {
        name: 'Open new ticket',
        link: OPEN_NEW_TICKET,
        icon: EditFile,
    },
    {
        name: 'View all tickets',
        link: VIEW_ALL_TICKETS,
        icon: Files,
    },
]

export const OSSHelpOptions: HelpOptionType[] = [
    {
        name: 'Chat with support',
        link: DISCORD_LINK,
        icon: Chat,
        showSeparator: true,
    },

    {
        name: 'Raise an issue/request',
        link: RAISE_ISSUE,
        icon: EditFile,
    },
]
