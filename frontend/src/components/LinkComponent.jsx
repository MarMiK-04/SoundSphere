import {Link} from "react-router-dom"
import "../assets/styles/LinkComponent.css"
function LinkComponent({path,label}) {
  return (
      <Link to={path} className="auth-link">
          {label}
      </Link>
  )
}

export default LinkComponent
