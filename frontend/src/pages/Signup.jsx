import { useState } from "react";
import "../assets/styles/signup.css";
import InputField from "../components/InputField.jsx";
import AuthCard from "../components/AuthCard.jsx";
import Button from "../components/Button.jsx";
import useAuthStore from "../store/authStore.js";
import LinkComponent from "../components/LinkComponent.jsx";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom"

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();
    setValidationErrors({})
    if (form.confirmPassword !== form.password) {
      toast.error("Passwords do not match")
      return;
    }

    try {
      const res = await signup({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast.success(res.msg);
      setForm({ username: "", email: "", password: "", confirmPassword: "" });
      navigate("/login")
    } catch (error) {
      if (error.details) {
        const fieldErrors = {}
        error.details.forEach((err)=>{
          if(!fieldErrors[err.field]){
              fieldErrors[err.field] = []
          }
          fieldErrors[err.field].push(err.message)
        })
        setValidationErrors(fieldErrors)
      } else {
        toast.error(error.message);
      }
    }
  }

  const { signup, loading } = useAuthStore();

  return (
    <>
      <div className="background">
        <AuthCard>
          <form onSubmit={handleSubmit}>
            <h1>Signup</h1>
            <InputField
              placeholder={"username"}
              name={"username"}
              type={"text"}
              value={form.username}
              icon={<FaUser />}
              error = {validationErrors.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <InputField
              icon={<MdEmail />}
              placeholder={"email"}
              name={"email"}
              type={"email"}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error = {validationErrors.email}
            />
            <InputField
              placeholder={"password"}
              name={"password"}
              icon={<RiLockPasswordFill />}
              type={"password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error = {validationErrors.password}
            />
            <InputField
              icon={<RiLockPasswordFill />}
              placeholder={"confirm password"}
              name={"confirm password"}
              type={"password"}
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />

            <Button
              type={"submit"}
              text={loading ? "signing up..." : "Signup"}
              disabled={loading}
            />
            <div className="register-link">
              <p>
                Already have an account?{" "}
                <LinkComponent label={"Login"} path={"/login"} />
              </p>
            </div>
          </form>
        </AuthCard>
      </div>
    </>
  );
}

export default Signup;
