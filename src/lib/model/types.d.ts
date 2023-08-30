export interface LinkItem {
    target: string,
    name: string,
    icon?: string
}

export interface Image {
    src: string,
    title: string,
    description: string
}

export interface ImageCategory {
    title: string,
    description: string,
    images: Image[]
}