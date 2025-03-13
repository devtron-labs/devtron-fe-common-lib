import { ComponentProps } from 'react'
import Pride from 'react-canvas-confetti/dist/presets/pride'

const Confetti = () => {
    const decorateOptions: ComponentProps<typeof Pride>['decorateOptions'] = (options) => ({
        ...options,
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
    })

    return <Pride autorun={{ speed: 60, duration: 500 }} decorateOptions={decorateOptions} />
}

export default Confetti
