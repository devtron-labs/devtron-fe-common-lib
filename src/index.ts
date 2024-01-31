declare global {
    interface Window {
        __BASE_URL__: string
        __REACT_APP_ORCHESTRATOR_ROOT__: string
    }
}
export * from './Common'
