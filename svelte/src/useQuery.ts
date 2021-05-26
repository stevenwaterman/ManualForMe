import { useLocation } from 'svelte-navigator'
import queryString from 'query-string'
import { derived, Readable } from 'svelte/store'

function useAllQueryParams(): Readable<Record<string, string | string[]>> {
  return derived(useLocation(), location => queryString.parse(location.search))
}

function useOneQueryParam(key: string): Readable<string | string[]> {
  return derived(useAllQueryParams(), params => params[key])
}

export function useQuery(): Readable<Record<string, string | string[]>>
export function useQuery(key: string): Readable<string | string[]>
export function useQuery(
  key?: string
): Readable<Record<string, string | string[]> | string | string[]> {
  if (key === undefined) return useAllQueryParams()
  return useOneQueryParam(key)
}

function useAllHashParams(): Readable<Record<string, string | string[]>> {
  return derived(useLocation(), location => queryString.parse(location.hash))
}

function useOneHashParam(key: string): Readable<string | string[]> {
  return derived(useAllHashParams(), params => params[key])
}

export function useHash(): Readable<Record<string, string | string[]>>
export function useHash(key: string): Readable<string | string[]>
export function useHash(
  key?: string
): Readable<Record<string, string | string[]> | string | string[]> {
  if (key === undefined) return useAllHashParams()
  return useOneHashParam(key)
}
