import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { message } from "antd";
import UserApi from "../../api/UserApi";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  const userId = localStorage.getItem("userId");
  console.log(userId);

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["getUser", userId],
    queryFn: () => UserApi.getUser(userId),
    enabled: !!userId,
    onError: () => message.error("Không thể lấy thông tin người dùng."),
  });
  console.log(userData);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    agreeToTerms: false,
  });

  // Cập nhật thông tin khách hàng nếu có
  useEffect(() => {
    if (userData) {
      setCustomerInfo((prev) => ({
        ...prev,
        fullName: userData.fullName || "",
        phoneNumber: userData.phoneNumber || "",
        email: userData.email || "",
      }));
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const confirmOrderMutation = useMutation({
    mutationFn: (data) => {
      return UserApi.confirmOrder(data);
    },
    onSuccess: (response) => {
      message.success("Đặt vé thành công!");
      navigate(`/user/orders/${response.orderId}`);
    },
    onError: () => {
      message.error("Không thể đặt vé. Vui lòng thử lại.");
    },
  });

  // Xử lý xác nhận đơn hàng
  const handleConfirmOrder = () => {
    if (
      !customerInfo.fullName ||
      !customerInfo.phoneNumber ||
      !customerInfo.email ||
      !customerInfo.agreeToTerms
    ) {
      message.warning(
        "Vui lòng điền đầy đủ thông tin và chấp nhận điều khoản."
      );
      return;
    }

    const dataToSubmit = {
      ...orderData,
      customerInfo,
    };

    confirmOrderMutation.mutate(dataToSubmit);
  };

  if (isUserLoading) {
    return <p>Đang tải thông tin khách hàng...</p>;
  }

  return (
    <div className="container mx-auto my-20 px-4 text-white">
      <h2 className="text-2xl font-bold mb-6">Thanh toán và xác nhận</h2>

      {/* Thông tin khách hàng */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h3 className="text-lg font-bold mb-4">1. Thông tin khách hàng</h3>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Họ và tên *</label>
          <input
            type="text"
            name="fullName"
            value={customerInfo.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Số điện thoại *</label>
          <input
            type="text"
            name="phoneNumber"
            value={customerInfo.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={customerInfo.agreeToTerms}
            onChange={handleInputChange}
            className="mr-2"
          />
          <span className="text-gray-300">
            Đồng ý với{" "}
            <a href="#terms" className="text-blue-500">
              điều khoản của Cinestar
            </a>
            .
          </span>
        </div>
      </div>

      {/* Thanh toán */}
      <div className="bg-gray-800 p-4 rounded mb-6">
        <h3 className="text-lg font-bold mb-4">2. Thanh toán</h3>
        <p className="text-gray-300 mb-4">
          Số tiền cần thanh toán: <strong>95,000 VND</strong>
        </p>
        <button
          className="py-2 px-4 bg-blue-600 text-white rounded shadow hover:bg-blue-500 transition"
          onClick={handleConfirmOrder}
          disabled={confirmOrderMutation.isLoading}
        >
          {confirmOrderMutation.isLoading ? "Đang xử lý..." : "Tiếp tục"}
        </button>
      </div>

      {/* Step 3: Ticket Information */}
      <div className="bg-gray-800 p-4 rounded">
        <h3 className="text-lg font-bold mb-4">3. Thông tin vé phim</h3>
        <p className="text-gray-300 mb-2"><strong>Phim:</strong> {orderData?.movieName || "N/A"}</p>
        <p className="text-gray-300 mb-2"><strong>Rạp:</strong> {orderData?.theaterName || "N/A"}</p>
        <p className="text-gray-300 mb-2"><strong>Phòng chiếu:</strong> {orderData?.roomName || "N/A"}</p>
        <p className="text-gray-300 mb-2"><strong>Thời gian:</strong> {orderData?.showtime || "N/A"}</p>
        <p className="text-gray-300 mb-2"><strong>Số ghế:</strong> {orderData?.seats?.join(", ") || "N/A"}</p>
      </div>
    </div>
  );
};

export default CheckoutPage;
