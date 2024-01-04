import type {ImageSrc} from "./model/types";

export const imgMaxWidth = 3500

export const validSources = (sources: ImageSrc[]) => sources.filter(src => src.width <= imgMaxWidth)