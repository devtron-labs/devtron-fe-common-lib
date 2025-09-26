import RadioGroup from '@Common/RadioGroup'
import RadioGroupItem from '@Common/RadioGroupItem'
import { AuthenticationType } from '@Shared/types'

import { CustomInput, PasswordField } from '../CustomInput'
import { InfoBlock } from '../InfoBlock'
import { Textarea } from '../Textarea'
import { PromoetheusConfigProps } from './types'

const PromoetheusConfigCard = ({
    prometheusConfig,
    handleOnChange,
    onPrometheusAuthTypeChange,
}: PromoetheusConfigProps) => {
    const { endpoint, authType, userName, password, prometheusTlsClientCert, prometheusTlsClientKey } = prometheusConfig

    return (
        <div className="bg__primary p-20 br-8 flexbox-col dc__gap-16 border__secondary">
            <div className="flexbox-col">
                <span className="fs-13 fw-6 lh-1-5 cn-9">Prometheus configurations</span>
                <span className="fs-13 fw-4 lh-1-5 cn-7">
                    Devtron uses prometheus to store and track cluster metrics
                </span>
            </div>
            {(userName.error || password.error || endpoint.error) && (
                <InfoBlock
                    variant="error"
                    description="Fill all the required fields OR turn off the above switch to skip configuring prometheus."
                />
            )}
            <CustomInput
                required
                placeholder="Enter endpoint"
                name="endpoint"
                value={endpoint.value}
                error={endpoint.error}
                onChange={handleOnChange}
                label="Prometheus endpoint"
            />
            <div>
                <span className="form__label dc__required-field">Authentication Type</span>
                <RadioGroup
                    value={authType.value}
                    name="authType"
                    onChange={onPrometheusAuthTypeChange}
                    className="radio-group-no-border"
                >
                    <RadioGroupItem value={AuthenticationType.BASIC}> Basic </RadioGroupItem>
                    <RadioGroupItem value={AuthenticationType.ANONYMOUS}> Anonymous </RadioGroupItem>
                </RadioGroup>
            </div>
            {authType.value === AuthenticationType.BASIC ? (
                <>
                    <div className="w-50">
                        <CustomInput
                            placeholder="Enter username"
                            name="userName"
                            value={userName.value}
                            error={userName.error}
                            onChange={handleOnChange}
                            label="Username"
                            required
                        />
                    </div>
                    <div className="w-50">
                        <PasswordField
                            placeholder="Enter password"
                            name="password"
                            value={password.value}
                            error={password.error}
                            onChange={handleOnChange}
                            label="Password"
                            shouldShowDefaultPlaceholderOnBlur={false}
                            required
                        />
                    </div>
                </>
            ) : null}
            <Textarea
                label="TLS Key"
                name="prometheusTlsClientKey"
                value={prometheusTlsClientKey.value}
                onChange={handleOnChange}
                placeholder="Enter TLS Key"
            />
            <Textarea
                label="TLS Certificate"
                name="prometheusTlsClientCert"
                value={prometheusTlsClientCert.value}
                onChange={handleOnChange}
                placeholder="Enter TLS Certificate"
            />
        </div>
    )
}

export default PromoetheusConfigCard
