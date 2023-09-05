import type {PathLike} from "fs";
import {access, mkdir, rm} from "fs/promises";
import crypto from "crypto";
import type {ImageAuthor} from "../../model/types";
import {defaultImageType} from "./config";
import type {ImageRaw} from "./types";
import {pathExists, ensurePathExists} from "../../util";

export async function clearPath(path: PathLike) {
    if (await pathExists(path)) {
        await rm(path, { recursive: true })
    }
    await ensurePathExists(path)
}

export function timeout(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(() => resolve(), duration))
}

export function fileNameHash() : string {
    return crypto.randomBytes(16).toString('hex')
}

export function replaceExtension(subject: string, newExtension: string) {
    return subject.substring(0, subject.lastIndexOf('.') + 1) + newExtension
}

export function checkAuthor(author: string, authors: Map<string, ImageAuthor>) {
    if (!authors.has(author.toLowerCase())) throw new Error(`Encountered unknown author ${author}`)
}

export function fileNameFromImage(rawImage: ImageRaw) : string {
    let name = rawImage.src
    if (!name) {
        name = ''
        if (!rawImage.ignoreAuthorName) name += `${rawImage.author.toLowerCase()}-`
        const fileType = rawImage.format ?? defaultImageType
        name += `${rawImage.name}.${fileType}`
    }
    return name
}