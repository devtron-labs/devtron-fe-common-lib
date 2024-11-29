export interface NumbersCountProps {
    count: number
    /**
     * @default false
     * @description If true, it will change the bgColor to var(--B500)
     */
    isSelected?: boolean
    /**
     * @default false
     * @description If true, it will show the count with tilde like ~number
     */
    isApprox?: boolean
}
