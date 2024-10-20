import {dev} from "$app/environment"

// As of now, this doesn't require client side JavaScript. Setting this option to false prevents any
// hydration, which isn't needed right now. The year in the footer will be evaluated at render time...
// It's enabled in dev mode though to enable hot reloading
export const csr = dev

// Prerender the application by default
export const prerender = true