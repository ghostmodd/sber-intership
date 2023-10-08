import "svelte/store"
import {readable, writable} from "svelte/store";

export const currencies = writable([
  "USD"
])

export const rates = writable({
})
