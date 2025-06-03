import './button.css';
const Button = ({buttonText, onClick, styles }) => {
    const buttonlabel = buttonText;
    const onclick = onClick;
    const style = styles;
    return (
        <button onClick={onclick} className={style}>
            {buttonlabel}
        </button>
    );

}

export default Button;