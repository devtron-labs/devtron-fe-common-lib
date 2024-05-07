const selectedStyles = {
    background: 'var(--B100)',
    color: 'var(--B500)',

    hover: {
        background: 'var(--B500)',
        color: '#fff',
    },
}

const hoveredSpanStyles = {
    background: 'var(--B100)',
    color: 'var(--B500)',
}

const selectedSpanStyles = {
    background: 'var(--B100)',
    color: 'var(--B500)',
    hover: {
        background: 'var(--B500)',
        color: '#fff',
    },
}

export const customDayStyles = {
    selectedStartStyles: selectedStyles,
    selectedEndStyles: selectedStyles,
    hoveredSpanStyles,
    selectedSpanStyles,
    selectedStyles,
    border: 'none',
}
