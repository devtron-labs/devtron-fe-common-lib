import moment from 'moment'

const DevtronCopyright = () => {
    const currentYear = moment().year()
    return <p className="fs-13 cn-5 fw-4 lh-20 m-0">Copyright &copy; {currentYear} Devtron Inc. All rights reserved.</p>
}

export default DevtronCopyright
