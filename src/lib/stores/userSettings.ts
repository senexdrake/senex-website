import { writable } from 'svelte/store'
import { browser } from '$app/env'

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
    const localStorageContent = localStorage.getItem(localStorageKey)
    if (localStorageContent) initialValue = JSON.parse(localStorageContent)
}

export const userSettings = writable(initialValue)

userSettings.subscribe((value) => {
    if (browser) {
        localStorage.setItem(localStorageKey, JSON.stringify(value))
    }
})