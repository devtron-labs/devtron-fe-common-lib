/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Default variables and style keys

import { ReactDiffViewerProps } from 'react-diff-viewer-continued'

export const diffViewerStyles: ReactDiffViewerProps['styles'] = {
    variables: {
        light: {
            diffViewerBackground: 'var(--bg-primary)',
            diffViewerColor: 'var(--N900)',
            addedBackground: 'var(--G50)',
            addedColor: 'var(--N900)',
            removedBackground: 'var(--R50)',
            removedColor: 'var(--N900)',
            wordAddedBackground: 'var(--G200)',
            wordRemovedBackground: 'var(--R200)',
            addedGutterBackground: 'var(--G100)',
            removedGutterBackground: 'var(--R100)',
            gutterBackground: 'var(--bg-secondary)',
            gutterBackgroundDark: 'var(--bg-secondary)',
            highlightBackground: 'var(--N100)',
            highlightGutterBackground: 'var(--N100)',
            codeFoldGutterBackground: 'var(--B100)',
            codeFoldBackground: 'var(--B50)',
            emptyLineBackground: 'var(--bg-primary)',
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
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '20px',

        pre: {
            fontSize: '14px',
            lineHeight: '20px',
            fontFamily: 'Inconsolata, monospace',
            wordBreak: 'break-word',
            // Reset for styling from patternfly
            padding: 0,
            margin: 0,
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 0,
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
        // Cursor would be default for all cases in gutter till we don't support highlighting
        cursor: 'default',

        pre: {
            opacity: 1,
        },
    },
    wordDiff: {
        padding: 0,
    },
    wordAdded: {
        paddingInline: '2px',
        lineHeight: '16px',
    },
    wordRemoved: {
        paddingInline: '2px',
        lineHeight: '16px',
    },
    codeFold: {
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '20px',
        height: '32px',

        a: {
            textDecoration: 'none !important',
        },
    },
    codeFoldGutter: {
        '+ td': {
            width: '12px',
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
