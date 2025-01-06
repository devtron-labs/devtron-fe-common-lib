export const setItemInLocalStorageIfKeyExists = (localStorageKey: string, value: string) => {
    if (localStorageKey) {
        localStorage.setItem(localStorageKey, value)
    }
}

export const parseAllSearchParamsForUseUrlFilters = <T,>(params: URLSearchParams) =>
    Array.from(params.entries()).reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
    }, {} as T)
