import type {Metadata} from "$model/types"
import {defaultTitle} from "$/config"

export function load() {
    return <Metadata>{
        title: defaultTitle + " - Legal stuff"
    }
}