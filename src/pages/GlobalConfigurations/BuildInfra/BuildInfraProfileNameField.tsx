import { FormEvent, FunctionComponent } from 'react'
import { BuildInfraMetaConfigTypes, BuildInfraInputFieldComponentProps } from './types'
import { CustomInput } from '../../../Common'
import { BUILD_INFRA_TEXT } from './constants'

const BuildInfraProfileNameField: FunctionComponent<BuildInfraInputFieldComponentProps> = ({
    handleProfileInputChange,
    currentValue,
    error,
}) => {
    const handleChange = (e: FormEvent<HTMLInputElement>) => {
        handleProfileInputChange({ action: BuildInfraMetaConfigTypes.NAME, data: { value: e.currentTarget.value } })
    }

    return (
        <div className="flexbox-col dc__gap-4 dc__mxw-420 w-100 dc__align-start">
            <CustomInput
                name="profile-name"
                label={BUILD_INFRA_TEXT.PROFILE_LABEL}
                labelClassName="m-0 fs-13 fw-4 lh-20 cn-7"
                placeholder={BUILD_INFRA_TEXT.PROFILE_PLACEHOLDER}
                value={currentValue}
                onChange={handleChange}
                error={error}
                required
            />
        </div>
    )
}

export default BuildInfraProfileNameField
