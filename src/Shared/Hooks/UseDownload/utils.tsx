export const getDefaultFileName = (headers: Headers) =>
    headers
        ?.get('content-disposition')
        ?.split(';')
        ?.find((n) => n.includes('filename='))
        ?.replace('filename=', '')
        .trim()
