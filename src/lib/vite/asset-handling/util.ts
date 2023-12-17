import crypto from "crypto";
import type {ImageAuthor} from "../../model/types";
import {defaultImageType} from "./config";
import type {ImageRaw} from "./types";
import {marked} from "marked";
import {chalk} from "../../util";

export {clearPath, addTrailingSlash, chalk, formatBytes, pathExists} from "../../util";

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

export function formattedDuration(start: number, end: number = Date.now()): string {
    return formatTime(end - start)
}

export function formatTime(time: number): string {
    return (time / 1000).toString() + "s"
}

function createPlainTextRenderer() {
    const htmlEscapeToText = (text) => {
        return text.replace(/\&\#[0-9]*;|&amp;/g, function (escapeCode) {
            if (escapeCode.match(/amp/)) {
                return '&';
            }
            return String.fromCharCode(escapeCode.match(/[0-9]+/));
        });
    }

    const render = new marked.Renderer();

    render.text = (text) => {
        return text
    }

    render.br = () => {
        return "\n";
    }

    render.del = (text) => {
        return text
    }

    render.codespan = (code) => {
        return code
    }

    render.em = (text) => {
        return text
    }

    // render just the text of a link
    render.link = (href, title, text) => {
        return text;
    };

    // render just the text of a paragraph
    render.paragraph = function (text) {
        return htmlEscapeToText(text)+'\r\n';
    };

    // render just the text of a heading element, but indecate level
    render.heading = (text, level) => {
        return level + ' ) ' + text;
    };

    // render nothing for images
    render.image = () => {
        return '';
    };

    return render;
}

export const plainTextRenderer = createPlainTextRenderer()

export const timeLog = chalk.green