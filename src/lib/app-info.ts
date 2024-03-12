import appInfoRaw from "$lib/data/appInfo.json"
import type {AppInfo} from "$lib/vite/vite-app-info";

const appInfo = appInfoRaw as AppInfo

export const appVersion = appInfo.version
export const publicUrl = appInfo.publicUrl