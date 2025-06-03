import './TextField.css';


const TextField = ({label, type="text", name, value, onChange, placeHolder, styles=""}) =>{
    return(
        <div className="textfield-container">
          {label && <label htmlFor={name} className="textfield-label">{label}</label>}
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeHolder}
                className={`textfield-input ${styles}`}
                autoComplete="off"
            />
        </div>
    );

}

export default TextField;