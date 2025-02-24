import React, { useState } from "react";
import { Form, Input, Button, message, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { TokenManager } from "../api/apiClient";
import loginBackground from "../assets/images/footer-bg.jpg";
import { decodeJwt } from "jose"; 

const getRoleFromToken = (token) => {
  try {
    var payload = decodeJwt(token); 
    localStorage.setItem("userId", payload.id);
    const roles = payload.authorities || payload.scope || [];

    // Determine role based on included roles
    if (roles.includes("ADMIN")) {
      return "Admin";
    } else if (roles.includes("USER")) {
      return "User";
    } else {
      return "Unknown";
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return "Unknown";
  }
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const accessToken = await TokenManager.getAccessToken({
        username: values.username,
        password: values.password,
      });
      localStorage.setItem('username', values.username);
      localStorage.setItem('password', values.password);      if (accessToken) {
      const userRole = getRoleFromToken(accessToken);

        if (userRole === "Admin") {
          navigate("/admin"); // Redirect to admin dashboard if role is ADMIN
        } else if (userRole === "User") {
          navigate("/user"); // Redirect to user homepage if role is USER
        } else {
          message.error("Unknown role");
        }
      } else {
        message.error("Failed to login");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      message.error("Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="font-[netflix-serif] min-h-screen flex flex-col items-center justify-center py-6 px-4"
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="grid md:grid-cols-2 bg-black bg-opacity-40 items-center gap-10 max-w-6xl w-full">
        <div className="hidden md:block text-white">
          <h2 className="lg:text-5xl text-4xl font-extrabold">
            Login for Exclusive Access
          </h2>
          <p className="text-lg mt-6 ">
          Seamlessly access your Betflix account with our streamlined, user-friendly login experience. 
          Log in effortlessly and dive back into the entertainment.
          </p>
        </div>

        <div className=" max-w-md md:ml-auto w-full  p-8 rounded shadow-md text-white items-center ">
          <h3 className=" text-3xl lg:text-5xl font-extrabold mb-8 text-center">
            Log in
          </h3>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className="space-y-4 "
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
              className="rounded-xl"
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-white  ">Remember me</Checkbox>
              </Form.Item>
              <a
                className="float-right text-red-700 hover:text-red-900 hover:underline font-semibold"
                href="javascript:void(0);"
              >
                Forgot your password?
              </a>
            </Form.Item>
            <Form.Item  >
              <Button
                type="primary"
                style={{ backgroundColor: "red", color: "white" }}
                htmlType="submit"
                loading={loading}
                className="w-full bg-red-700 hover:text-gray-900 font-bold"
              >
                Log in now
              </Button>
            </Form.Item>

            <p className="text-lg  mt-12 text-white flex">
              Don't have an account?
              <Button
                type="link"
                onClick={() => navigate("/register")}
                className=" text-xl text-white hover:bg-black hover: ml-auto "
              >
                Register here
              </Button>
            </p>
          </Form>

          <div className="space-x-6 flex justify-center mt-8">
            <Button type="link" className="border-none outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32px"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#fbbd00"
                  d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                  data-original="#fbbd00"
                />
                <path
                  fill="#0f9d58"
                  d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                  data-original="#0f9d58"
                />
                <path
                  fill="#31aa52"
                  d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                  data-original="#31aa52"
                />
                <path
                  fill="#3c79e6"
                  d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                  data-original="#3c79e6"
                />
                <path
                  fill="#cf2d48"
                  d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                  data-original="#cf2d48"
                />
                <path
                  fill="#eb4132"
                  d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                  data-original="#eb4132"
                />
              </svg>
            </Button>
            <Button type="link" className="border-none outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32px"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#1877f2"
                  d="M512 256c0 127.78-93.62 233.69-216 252.89V330h59.65L367 256h-71v-48.02c0-20.25 9.92-39.98 41.72-39.98H370v-63s-29.3-5-57.31-5c-58.47 0-96.69 35.44-96.69 99.6V256h-65v74h65v178.89C93.62 489.69 0 383.78 0 256 0 114.62 114.62 0 256 0s256 114.62 256 256z"
                  data-original="#1877f2"
                />
                <path
                  fill="#fff"
                  d="M355.65 330 367 256h-71v-48.021c0-20.245 9.918-39.979 41.719-39.979H370v-63s-29.296-5-57.305-5C254.219 100 216 135.44 216 199.6V256h-65v74h65v178.889c13.034 2.045 26.392 3.111 40 3.111s26.966-1.066 40-3.111V330z"
                  data-original="#ffffff"
                />
              </svg>
            </Button>

            <Button type="link" className="border-none outline-none ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32px"
                viewBox="0 0 22.773 22.773"
              >
                <path
                  d="M15.769 0h.162c.13 1.606-.483 2.806-1.228 3.675-.731.863-1.732 1.7-3.351 1.573-.108-1.583.506-2.694 1.25-3.561C13.292.879 14.557.16 15.769 0zm4.901 16.716v.045c-.455 1.378-1.104 2.559-1.896 3.655-.723.995-1.609 2.334-3.191 2.334-1.367 0-2.275-.879-3.676-.903-1.482-.024-2.297.735-3.652.926h-.462c-.995-.144-1.798-.932-2.383-1.642-1.725-2.098-3.058-4.808-3.306-8.276v-1.019c.105-2.482 1.311-4.5 2.914-5.478.846-.52 2.009-.963 3.304-.765.555.086 1.122.276 1.619.464.471.181 1.06.502 1.618.485.378-.011.754-.208 1.135-.347 1.116-.403 2.21-.865 3.652-.648 1.733.262 2.963 1.032 3.723 2.22-1.466.933-2.625 2.339-2.427 4.74.176 2.181 1.444 3.457 3.028 4.209z"
                  data-original="#000000"
                ></path>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
