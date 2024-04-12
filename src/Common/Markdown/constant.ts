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

export const MARKDOWN_EDITOR_COMMAND_ICON_TIPPY_CONTENT = {
    [MARKDOWN_EDITOR_COMMAND_TITLE.HEADER]: 'Add heading text',
    [MARKDOWN_EDITOR_COMMAND_TITLE.BOLD]: 'Add bold text',
    [MARKDOWN_EDITOR_COMMAND_TITLE.ITALIC]: 'Add italic text',
    [MARKDOWN_EDITOR_COMMAND_TITLE.STRIKETHROUGH]: 'Add strikethrough text',
    [MARKDOWN_EDITOR_COMMAND_TITLE.LINK]: 'Add a link',
    [MARKDOWN_EDITOR_COMMAND_TITLE.QUOTE]: 'Add a quote',
    [MARKDOWN_EDITOR_COMMAND_TITLE.CODE]: 'Add code',
    [MARKDOWN_EDITOR_COMMAND_TITLE.IMAGE]: 'Add image via link',
    [MARKDOWN_EDITOR_COMMAND_TITLE.UNORDERED_LIST]: 'Add a bulleted list',
    [MARKDOWN_EDITOR_COMMAND_TITLE.ORDERED_LIST]: 'Add a numbered list',
    [MARKDOWN_EDITOR_COMMAND_TITLE.CHECKED_LIST]: 'Add a task list',
}
