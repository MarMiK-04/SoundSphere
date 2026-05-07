import "../assets/styles/Button.css"
function Button({type="button",text,disabled=false,onClick}) {
  return (
      <button type={type} disabled={disabled} onClick={onClick}>{text}</button>
  )
}

export default Button
