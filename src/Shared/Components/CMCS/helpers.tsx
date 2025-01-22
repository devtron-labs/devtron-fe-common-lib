import { InfoColourBar } from '@Common/index'
import { ReactComponent as ICWarningY5 } from '@Icons/ic-warning-y5.svg'

export const renderHashiOrAwsDeprecatedInfo = () => (
    <InfoColourBar
        classname="warn"
        message={
            <p className="m-0 cn-9 fs-13 lh-20">
                <span>
                    Kubernetes External Secret (KES) has been deprecated and will be removed in the next Devtron
                    version. You can delete this file and create a secret using
                </span>
                &nbsp;
                <a
                    className="anchor"
                    href="https://github.com/external-secrets/external-secrets"
                    rel="noreferrer noopener"
                    target="_blank"
                >
                    External Secret Operator (ESO).
                </a>
            </p>
        }
        Icon={ICWarningY5}
        iconSize={20}
    />
)
