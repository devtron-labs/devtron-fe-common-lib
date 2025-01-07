export const getCVEUrlFromCVEName = (cveName: string): string =>
    `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cveName}`
