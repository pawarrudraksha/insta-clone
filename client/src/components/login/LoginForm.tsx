import React, { useState } from "react";
import styles from "../../styles/login/loginForm.module.css";
import { FaFacebookSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BiCheckCircle } from "react-icons/bi";
import { login, setCurrentUser } from "../../app/features/authSlice";
import { useAppDispatch } from "../../app/hooks";

interface formDataProps {
  usernameOrEmail: string;
  password: string;
}
const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isNotValidated, setIsNotValidated] = useState<string>("");
  const [isValidated, setIsValidated] = useState<string[]>([]);
  const [formData, setFormData] = useState<formDataProps>({
    password: "",
    usernameOrEmail: "",
  });

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsNotValidated("");
    if (e.target.name === "usernameOrEmail") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value.toLowerCase(),
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };
  const isFormFilled: boolean =
    Boolean(formData.usernameOrEmail) && Boolean(formData.password);

  const handleLogin = async () => {
    setIsNotValidated("");
    if (
      !formData.usernameOrEmail.includes("@") &&
      !/^[a-zA-Z_]/.test(formData.usernameOrEmail.charAt(0))
    ) {
      if (isValidated.includes("usernameOrEmail")) {
        setIsValidated((prevData) =>
          prevData.filter((item) => item !== "usernameOrEmail")
        );
      }
      setIsNotValidated("usernameOrEmail");
      return;
    } else {
      setIsValidated((prevState) => [...prevState, "usernameOrEmail"]);
    }

    if (formData.password.length !== 8) {
      if (isValidated.includes("password")) {
        setIsValidated((prevData) =>
          prevData.filter((item) => item !== "password")
        );
      }
      setIsNotValidated("password");
      return;
    } else {
      setIsValidated((prevState) => [...prevState, "password"]);
    }
    const receivedData: any = await dispatch(login(formData));
    dispatch(setCurrentUser(receivedData?.payload?.data?.user));
    navigate("/");
  };
  return (
    <div className={styles.loginFormContainer}>
      <p className={styles.loginFormTitle}>Instagram</p>
      <div className={styles.loginFormInputs}>
        <div
          className={`${styles.loginFormInput} ${
            formData.usernameOrEmail.length > 0 && styles.loginFormInputAlignEnd
          }`}
        >
          <input
            type={"email" || "text"}
            placeholder="Username or email"
            value={formData.usernameOrEmail}
            onChange={handleFormDataChange}
            name="usernameOrEmail"
          />
          {isNotValidated === "usernameOrEmail" && (
            <IoCloseCircleOutline className={styles.loginFormCloseIcon} />
          )}
          {isValidated.includes("usernameOrEmail") && (
            <BiCheckCircle className={styles.loginFormCheckIcon} />
          )}
          {formData.usernameOrEmail.length > 0 && (
            <p className={styles.loginInputName}>Username or Email</p>
          )}
        </div>

        <div
          className={`${styles.loginFormInput} ${
            formData.password.length > 0 && styles.loginFormInputAlignEnd
          }`}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleFormDataChange}
            name="password"
          />
          {isNotValidated === "password" && (
            <IoCloseCircleOutline
              className={`${styles.loginFormCloseIcon} ${
                (isValidated.includes("password") ||
                  isNotValidated === "password") &&
                styles.loginIconWhenShowPassword
              }`}
            />
          )}
          {isValidated.includes("password") && (
            <BiCheckCircle
              className={`${styles.loginFormCheckIcon} ${
                (isValidated.includes("password") ||
                  isNotValidated === "password") &&
                styles.loginIconWhenShowPassword
              }`}
            />
          )}
          {formData.password.length > 0 && (
            <p
              className={styles.loginShowPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </p>
          )}
          {formData.password.length > 0 && (
            <p className={styles.loginInputName}>Password</p>
          )}
        </div>
        <button
          className={`${styles.loginBtn} ${
            !isFormFilled && styles.disabledLoginBtn
          }`}
          onClick={handleLogin}
          disabled={!isFormFilled}
        >
          Log in
        </button>
        <div className={styles.loginFormOrDividerContainer}>
          <div className={styles.loginFormOrDivider}></div>
          <div className={styles.loginFormOrDividerContent}>
            <p>OR</p>
          </div>
        </div>
        <div className={styles.loginFormFacebookLoginBtn}>
          <FaFacebookSquare />
          <p>Log in with Facebook</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
