import { FormFieldWrapperProps } from './types'
import FormFieldLabel from './FormFieldLabel'
import FormFieldInfo from './FormFieldInfo'

const FormFieldWrapper = ({
    layout,
    fullWidth,
    label,
    inputId,
    error,
    helperText,
    warningText,
    required,
    children,
    labelTippyCustomizedConfig,
    labelTooltipConfig,
}: Required<FormFieldWrapperProps>) => {
    const isRowLayout = layout === 'row'
    const itemContainerClassName = isRowLayout ? 'dc__mxw-250 w-100 mxh-36 dc__align-self-stretch' : ''

    return (
        <div className={`flex left column top dc__gap-4 ${fullWidth ? 'w-100' : ''}`}>
            <div className={`flex left top dc__gap-6 ${!isRowLayout ? 'column' : ''} w-100`}>
                {label && (
                    <div className={`${itemContainerClassName} flex left`}>
                        <FormFieldLabel
                            inputId={inputId}
                            label={label}
                            required={required}
                            layout={layout}
                            {...(isRowLayout
                                ? {
                                      labelTooltipConfig,
                                  }
                                : {
                                      labelTippyCustomizedConfig,
                                  })}
                        />
                    </div>
                )}
                <div className="w-100 dc__position-rel">{children}</div>
            </div>
            {(error || helperText || warningText) && (
                <div className="flex left dc__gap-6 w-100">
                    {/* Added a hidden div for layout sync */}
                    {isRowLayout && <div className={`${itemContainerClassName} dc__visibility-hidden`} />}
                    <FormFieldInfo inputId={inputId} error={error} helperText={helperText} warningText={warningText} />
                </div>
            )}
        </div>
    )
}

export default FormFieldWrapper
