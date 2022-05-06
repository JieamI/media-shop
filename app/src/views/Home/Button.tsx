import { useRef } from 'react'
import style from '../../styles/home.module.scss'
import { useNavigate } from 'react-router-dom'


export function Button() {
    const inputRef = useRef(null)
    const navigate = useNavigate()
    const handleChange = () => {
        const el = inputRef.current as unknown as HTMLInputElement
        if(el.files?.length) {
            const file =  el.files[0]
            navigate("/gallery", {
                state: {
                    file
                }
            })
        }
    }
    return (
        <div>
            <label htmlFor="file-input" className={ style["button-upload"] }>
                <span className={ style["button-text"] }>打开图片</span>
            </label>
            <input ref={ inputRef } type="file" id="file-input" className={ style["button-fileinput" ] } onChange={ handleChange }></input>
        </div>
    )
}

