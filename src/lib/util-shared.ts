export const addTrailingSlash = (input: string) => input + (input.endsWith('/') ? '' : '/')

export const stripLeadingSlash = (input: string) => {
    const startIndex = input.startsWith('/') ? 1 : 0
    return input.substring(startIndex)
}
export const stripTrailingSlash = (input: string) => input.substring(0, input.length - (input.endsWith('/') ? 1 : 0) )