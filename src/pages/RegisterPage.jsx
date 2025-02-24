import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import UserApi from "../api/userApi";
import registerBackground from "../assets/images/footer-bg.jpg";


const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await UserApi.createUser({
        email: values.email,
        username: values.username,
        password: values.password,
      });
      message.success("Registration successful");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.log("Error registering:", error);
      message.error("User name or email already exists");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="font-[netflix-serif] min-h-screen  flex flex-col items-center justify-center py-6 px-4"
      style={{
        backgroundImage: `url(${registerBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-black opa p-8 rounded bg-opacity-40 items-center shadow-md w-full max-w-md text-white">
        <h2 className="text-3xl lg:text-5xl font-extrabold mb-8 text-center">Register</h2>
        <Form name="register" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" style={{ color: "black" }} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              style={{ backgroundColor: "#b91c1c", borderColor: "#7f1d1d" }}
              className="w-full hover:bg-red-900 font-bold  text-white"
            >
              Register Now
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-4">
          <Button type="link" onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
