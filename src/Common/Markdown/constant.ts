// TODO: Remove from dashboard
export const DEFAULT_MARKDOWN_EDITOR_PREVIEW_MESSAGE = `
<br>
Nothing to preview
`
export const MARKDOWN_EDITOR_COMMANDS = [
    [
        'header',
        'bold',
        'italic',
        'strikethrough',
        'link',
        'quote',
        'code',
        'image',
        'unordered-list',
        'ordered-list',
        'checked-list',
    ],
]

export enum MARKDOWN_EDITOR_COMMAND_TITLE {
    HEADER = 'header',
    BOLD = 'bold',
    ITALIC = 'italic',
    STRIKETHROUGH = 'strikethrough',
    LINK = 'link',
    QUOTE = 'quote',
    CODE = 'code',
    IMAGE = 'image',
    UNORDERED_LIST = 'unordered-list',
    ORDERED_LIST = 'ordered-list',
    CHECKED_LIST = 'checked-list',
}
