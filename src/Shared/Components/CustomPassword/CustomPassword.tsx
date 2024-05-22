import { useState } from 'react'
import { ReactComponent as Show } from '../../../Assets/Icon/ic-visibility-off.svg'
import { ReactComponent as FormError } from '../../../Assets/Icon/ic-warning.svg'
import './customPassword.css'

const CustomPassword = ({ name, value, error, onChange, label, disabled = false }: any) => {
    const [showPassword, setShowPassword] = useState(false)
    const type = showPassword ? 'text' : 'password'

    const handleClick = () => setShowPassword(!showPassword)

    return (
        <div className="flex column left top">
            <label className="form__label" htmlFor={name}>
                {label}
            </label>
            <div className="pos-relative w-100">
                <input
                    type={type}
                    name={name}
                    className="form__input p-r-41"
                    onChange={(e) => {
                        e.persist()
                        onChange(e)
                    }}
                    value={value}
                    disabled={disabled}
                    id={name}
                />
                <button
                    type="button"
                    className="dc__transparent custom-password__show-btn"
                    onClick={handleClick}
                    style={{ bottom: error ? 28 : 7 }}
                    aria-label="show/hide password"
                >
                    <Show className={`icon-dim-24 ${showPassword ? 'icon-n5' : 'icon-n3'}`} />
                </button>
            </div>
            {error && (
                <div className="form__error">
                    <FormError className="form__icon form__icon--error" />
                    {error}
                </div>
            )}
        </div>
    )
}

export default CustomPassword
