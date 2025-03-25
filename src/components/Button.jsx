const Button = ({id = '', className = '',  children = '', onClick}) => {
    return (
        <button
            onClick={onClick}
            id={id} 
            className={`btn ${className}`.trim()}>
            {children}
        </button>
    )
}
export default Button
