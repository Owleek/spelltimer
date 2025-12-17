export interface IStore {
    isVisible: boolean
    actions: {
        setVisible: (arg: boolean) => void
    }
}