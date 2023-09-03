
declare module '*?gallery' {
    import type {ImageOutputMetadata} from "$model/types";
    const images: ImageOutputMetadata[]
    export default images
}
declare module '*?fullsize' {
    import type {ImageOutputMetadata} from "$model/types";
    const image: ImageOutputMetadata
    export default image
}

declare module '*=srcset' {
    const images: string
    export default images
}