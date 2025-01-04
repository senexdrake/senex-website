export const addTrailingSlash = (input: string) => input + (input.endsWith('/') ? '' : '/')

export const stripLeadingSlash = (input: string) => {
    const startIndex = input.startsWith('/') ? 1 : 0
    return input.substring(startIndex)
}
export const stripTrailingSlash = (input: string) => input.substring(0, input.length - (input.endsWith('/') ? 1 : 0) )

export const resolveLink = async (link: string): Promise<string> => {
    console.log('Resolving link:', link)
    const response = await fetch(link, {
        method: 'HEAD',
        redirect: 'manual'
    })
    const locationHeader = response.headers.get('Location')
    if (locationHeader) {
        return resolveLink(locationHeader)
    }
    return link
}

export const toBoolean = (input: unknown): boolean => {
    if (input == 1) return true
    if (typeof input == 'string') {
        const inputLower = input.toLowerCase()
        if (inputLower == 'true') return true
        if (inputLower == 'yes') return true
    }
    return false
}