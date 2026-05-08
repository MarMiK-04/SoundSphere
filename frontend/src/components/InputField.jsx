import "../assets/styles/InputFiled.css";

function InputField({ placeholder, type, value, onChange, icon, name, error }) {
  return (
    <div className="input-wrapper">
      <div className="input-group">
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required
          placeholder={placeholder}
        />

        {icon}
      </div>
      {error &&
        error.map((errMsg, index) => (
          <p key={index} className="input-error">
            {errMsg}
          </p>
        ))}
    </div>
  );
}
export default InputField;
