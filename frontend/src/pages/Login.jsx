import { useState } from "react";
import "../assets/styles/login.css";
import AuthCard from "../components/AuthCard.jsx";
import InputField from "../components/InputField.jsx";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import useAuthStore from "../store/authStore.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import LinkComponent from "../components/LinkComponent.jsx";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { login, loading} = useAuthStore();

  async function onSubmitHandler(e) {
    e.preventDefault();
    try {
      const res = await login({
        email: form.email,
        password: form.password,
      });
      toast.success(res.msg);
      setForm({
        email: "",
        password: "",
      });
      const currentUser = useAuthStore.getState().user
      if (currentUser.role === "admin") {
        navigate("/adminDashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.details) {
        const fieldErrors = {};
        error.details.forEach((err) => {
          if (!fieldErrors[err.field]) {
            fieldErrors[err.field] = [];
          }
          fieldErrors[err.field].push(err.message);
        });
        setValidationErrors(fieldErrors);
      } else {
        toast.error(error.message);
      }

      console.log(error)
    }
  }

  return (
    <>
      <div className="background">
        <AuthCard>
          <form onSubmit={(e) => onSubmitHandler(e)}>
            <h1>Login</h1>
            <InputField
              placeholder={"email"}
              type={"email"}
              value={form.email}
              icon={<MdEmail />}
              name={"email"}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={validationErrors.email}
            />

            <InputField
              placeholder={"password"}
              type={"password"}
              value={form.password}
              icon={<RiLockPasswordFill />}
              name={"password"}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={validationErrors.password}
            />

            <Button
              type={"submit"}
              disabled={loading}
              text={loading ? "loging......." : "Login"}
            />

            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <LinkComponent label={"Signup"} path={"/signup"} />
              </p>
            </div>
          </form>
        </AuthCard>
      </div>
    </>
  );
}

export default Login;
