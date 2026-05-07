import "../assets/styles/InputFiled.css";

function InputField({ placeholder, type, value, onChange, error, icon, name }) {
  return (
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default InputField;
