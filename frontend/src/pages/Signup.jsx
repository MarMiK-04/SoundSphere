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

function Signup() {
  const [form, setFrom] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.confirmPassword !== form.password) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await signup({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      console.log(res.msg);
    } catch (error) {
      console.log(error.message);
    }
  }

  const { signup, loading, error } = useAuthStore();

  return (
    <>
      <div className="background">
        <AuthCard>
          <form onSubmit={handleSubmit}>
            <h1>Signup</h1>
            <InputField
              placeholder={"Username"}
              name={"Username"}
              type={"text"}
              value={form.username}
              icon={<FaUser />}
              onChange={(e) => setFrom({ ...form, username: e.target.value })}
            />
            <InputField
              icon={<MdEmail />}
              placeholder={"email"}
              name={"email"}
              type={"email"}
              value={form.email}
              onChange={(e) => setFrom({ ...form, email: e.target.value })}
            />
            <InputField
              placeholder={"password"}
              name={"password"}
              icon={<RiLockPasswordFill />}
              type={"password"}
              value={form.password}
              onChange={(e) => setFrom({ ...form, password: e.target.value })}
            />
            <InputField
              icon={<RiLockPasswordFill />}
              placeholder={"confirm password"}
              name={"confirm password"}
              type={"password"}
              value={form.confirmPassword}
              onChange={(e) =>
                setFrom({ ...form, confirmPassword: e.target.value })
              }
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <Button
              type={"submit"}
              text={loading ? "signing up..." : "Signup"}
              disabled={loading}
            />
            <div className="register-link">
              <p>
                Don't have an account?{" "}
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
