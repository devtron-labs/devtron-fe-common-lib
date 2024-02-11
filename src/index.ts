declare global {
    interface Window {
        __BASE_URL__: string
        __ORCHESTRATOR_ROOT__: string
    }
}
export * from './Common'
export * from './Pages'
