export interface MarkDownProps {
    setExpandableIcon: (showExpandedIcon: boolean) => void
    markdown: string
    className: string
    breaks: boolean
    disableEscapedText: boolean
}
