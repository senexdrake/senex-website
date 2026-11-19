import type {Metadata} from "#lib/model/types.d.ts"
import {defaultTitle} from "#config"

export function load() {
    return <Metadata>{
        title: defaultTitle + " - Legal stuff"
    }
}