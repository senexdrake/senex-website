import { writable } from 'svelte/store'
import { browser } from '$app/environment'

export interface UserSettings {
    showNsfw: boolean,
    allowNsfw: boolean
}

let initialValue: UserSettings = {
    showNsfw: false,
    allowNsfw: false
}

const localStorageKey = 'userSettings'
if (browser) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const localStorageContent = localStorage.getItem(localStorageKey)
    if (localStorageContent) initialValue = JSON.parse(localStorageContent)
}

export const userSettings = writable(initialValue)

userSettings.subscribe((value) => {
    if (browser) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        localStorage.setItem(localStorageKey, JSON.stringify(value))
    }
})