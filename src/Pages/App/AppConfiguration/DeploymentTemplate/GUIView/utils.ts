import { ViewErrorType } from './types'

export class ViewError implements ViewErrorType {
    title: string = ''

    subTitle: string = ''

    constructor(title: string, subTitle: string) {
        this.title = title
        this.subTitle = subTitle
    }
}
