import { useLocation } from "svelte-navigator";
import queryString from "query-string";
import { derived, Readable } from "svelte/store";

function useAllQueryParams(): Readable<Record<string, string | string[]>> {
  return derived(useLocation(), location => queryString.parse(location.search))
}

function useOneQueryParam(key: string): Readable<string | string[]> {
  return derived(useAllQueryParams(), params => params[key]);
}

export default function useQuery(): Readable<Record<string, string | string[]>>;
export default function useQuery(key: string): Readable<string | string[]>;
export default function useQuery(key?: string): Readable<Record<string, string | string[]> | string | string[]> {
  if (key === undefined) return useAllQueryParams();
  return useOneQueryParam(key);
}

