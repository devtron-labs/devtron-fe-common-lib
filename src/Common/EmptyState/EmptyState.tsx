import * as React from 'react'
import './emptyState.scss'
import { ReactComponent as Progressing } from '../../Assets/Icon/ic-progressing.svg'

const EmptyState = ({ children, className = '' }) => (
    <div className={`flex column empty-state w-100 h-100 ${className}`}>{children}</div>
)

function Image({ children }) {
    return children
}

function Title({ children }) {
    return children
}

const Subtitle = ({ children, className }: { children: any; className?: string }) => (
    <p className={`subtitle ${className || ''}`}>{children}</p>
)

function Button({ children }) {
    return children
}

const Loading: React.FC<{ text: string }> = (props) => (
    <>
        <Progressing className="dc__block empty-state__loader" />
        <p className="empty-state__loading-text">{props.text}</p>
    </>
)

EmptyState.Image = Image
EmptyState.Title = Title
EmptyState.Subtitle = Subtitle
EmptyState.Button = Button
EmptyState.Loading = Loading

export default EmptyState
