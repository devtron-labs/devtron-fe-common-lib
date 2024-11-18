// Default variables and style keys

import { ReactDiffViewerProps } from 'react-diff-viewer-continued'

export const diffViewerStyles: ReactDiffViewerProps['styles'] = {
    variables: {
        light: {
            diffViewerBackground: 'var(--N0)',
            diffViewerColor: 'var(--N900)',
            addedBackground: 'var(--G50)',
            addedColor: 'var(--N900)',
            removedBackground: 'var(--R50)',
            removedColor: 'var(--N900)',
            wordAddedBackground: 'var(--G200)',
            wordRemovedBackground: 'var(--R200)',
            addedGutterBackground: 'var(--G100)',
            removedGutterBackground: 'var(--R100)',
            gutterBackground: 'var(--N50)',
            gutterBackgroundDark: 'var(--N50)',
            highlightBackground: 'var(--N100)',
            highlightGutterBackground: 'var(--N100)',
            codeFoldGutterBackground: 'var(--B100)',
            codeFoldBackground: 'var(--B50)',
            emptyLineBackground: 'var(--N0)',
            gutterColor: 'var(--N500)',
            addedGutterColor: 'var(--N700)',
            removedGutterColor: 'var(--N700)',
            codeFoldContentColor: 'var(--B600)',
            diffViewerTitleBackground: 'var(--N100)',
            diffViewerTitleColor: 'var(--N700)',
            diffViewerTitleBorderColor: 'var(--N200)',
        },
    },
    diffContainer: {
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: '20px',

        pre: {
            lineHeight: '20px',
            fontFamily: 'Inconsolata, monospace',
        },
    },
    marker: {
        pre: {
            display: 'none',
        },
    },
    gutter: {
        padding: `0 6px`,
        minWidth: '36px',

        pre: {
            opacity: 1,
        },
    },
    wordDiff: {
        padding: 0,
    },
    wordAdded: {
        paddingInline: '2px',
    },
    wordRemoved: {
        paddingInline: '2px',
    },
    codeFold: {
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: '20px',
        height: '32px',

        a: {
            textDecoration: 'none !important',
        },
    },
    titleBlock: {
        padding: '8px 12px',
        fontSize: '12px',
        lineHeight: '20px',
        fontWeight: 600,
        borderBottom: 'none',

        pre: {
            fontFamily: 'Open Sans',
        },
    },
}
