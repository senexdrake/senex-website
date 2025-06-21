import {linkResolverUserAgent} from "./../config.js";

export const addTrailingSlash = (input: string) => input + (input.endsWith('/') ? '' : '/')

export const stripLeadingSlash = (input: string) => {
    const startIndex = input.startsWith('/') ? 1 : 0
    return input.substring(startIndex)
}
export const stripTrailingSlash = (input: string) => input.substring(0, input.length - (input.endsWith('/') ? 1 : 0) )

export const resolveLink = async (link: string): Promise<string> => {
    console.log('Resolving link:', link)
    const response = await useFetch(link, {
        method: 'GET',
        redirect: 'manual',
        keepalive: false
    })
    if (response.status >= 400) {
        console.warn('Failed to resolve link:', link, response.status, response)
    }
    const locationHeader = response.headers.get('Location')
    if (locationHeader) {
        return resolveLink(locationHeader)
    }
    return link
}

export const toBoolean = (input: unknown): boolean => {
    if (typeof input == 'boolean') return input
    if (input == 1) return true
    if (typeof input == 'string') {
        const inputLower = input.toLowerCase()
        if (inputLower == 'true') return true
        if (inputLower == 'yes') return true
    }
    return false
}

const defaultFetchOptions: RequestInit = {
    headers: {
        'User-Agent': linkResolverUserAgent
    },
    method: 'GET',
    keepalive: true,
}
/**
 * Wrapper around `fetch()` that sets default options
 * @param input
 * @param init
 * @param timeout
 */
export const useFetch = (
    input: string | URL | globalThis.Request,
    init?: RequestInit,
    timeout: number = 30_000,
): Promise<Response> => {
    const mergedInit: RequestInit = {...defaultFetchOptions, ...init}
    if (mergedInit.signal === undefined) {
        mergedInit.signal = AbortSignal.timeout(timeout)
    }
    return fetch(input, mergedInit)
}