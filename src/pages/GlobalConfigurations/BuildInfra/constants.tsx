import { UseBreadcrumbProps } from '../../../Common/BreadCrumb/Types'

export const BUILD_INFRA_TEXT = {
    HEADING: 'Build Infra Configuration',
    EDIT_SUBMIT: 'Save changes',
    EDIT_CANCEL: 'Cancel',
    EDIT_DEFAULT_TOOLTIP:
        'Efficiently control infrastructure settings such as CPU, Memory, and Build timeout for your build pipelines. Streamline resource management to optimise build time and cost effortlessly.',
}

export const BUILD_INFRA_BREADCRUMB: UseBreadcrumbProps = {
    alias: {
        'global-config': null,
        'build-infra': {
            component: <h2 className="m-0 cn-9 fs-16 fw-6 lh-32">{BUILD_INFRA_TEXT.HEADING}</h2>,
            linked: false,
        },
    },
}
