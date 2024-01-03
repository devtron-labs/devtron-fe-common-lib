import { FieldRowProps } from './types'
import { DEFAULT_FIELD_TITLE, DO_NOT_SHOW_LABEL } from '../constants'

export const FieldRowWithLabel = ({
    showLabel,
    label,
    required,
    children,
    id,
    shouldAlignCenter = true,
}: Omit<FieldRowProps, 'label'> & {
    label: FieldRowProps['label'] | typeof DO_NOT_SHOW_LABEL
}) => (
    <div
        className={
            showLabel
                ? `display-grid dc__gap-12 rjsf-form-template__field ${shouldAlignCenter ? 'flex-align-center' : ''}`
                : ''
        }
    >
        {showLabel && (
            <label className="cn-7 fs-13 lh-32 fw-4 flexbox mb-0" htmlFor={id}>
                {/* The check is added here intentionally for proper layout for array type field */}
                {label !== DO_NOT_SHOW_LABEL && (
                    <>
                        <span className="dc__ellipsis-right">{label || DEFAULT_FIELD_TITLE}</span>
                        {required && <span className="cr-5">&nbsp;*</span>}
                    </>
                )}
            </label>
        )}
        {children}
    </div>
)
