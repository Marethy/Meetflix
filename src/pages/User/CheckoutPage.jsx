import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query"; // Thêm import useQuery ở đây
import { message } from "antd";
import { UserApi, OrderApi } from "../../api";
import axios from "axios";
import bgImage from "../../assets/images/bg.png";
import moment from "moment";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;
  const [paymentResponse, setPaymentResponse] = useState(null);

  const userId = localStorage.getItem("userId");

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["getUser", userId],
    queryFn: () => UserApi.getUser(userId),
    enabled: !!userId,
    onError: () => message.error("Không thể lấy thông tin người dùng."),
  });

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    agreeToTerms: false,
  });
  // Calculate total bill
  const seatPrice = 50000;
  const totalSeats = orderData?.seats?.length || 0;
  const totalBill = totalSeats * seatPrice;
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
  const handlePayment = async () => {
    const payload = {
      app_user: userData.fullName,
      amount: totalBill,
      bank_code: "zalo_payapp",
      embed_data: "{}",
      item: [
        {
          itemid: userData.userId,
          itemname: orderData.seats,
          itemprice: totalBill,
          itemquantity: totalSeats,
        },
      ],
      callback_url: "https://domain.com/callback",
      description: "ZaloPayDemo - Thanh toán cho đơn hàng",
    };

    try {
      const response = await axios.post(
        "http://localhost:8095/api/payment/zalo-pay",
        payload
      );
      setPaymentResponse("Api" + response.data);
      console.log(response.data);
    } catch (err) {
      console.log("api err" + err.data);
    }
  };
  const confirmOrderMutation = useMutation({
    mutationFn: (data) => {
      return OrderApi.createOrder(data);
    },
    onSuccess: (response) => {
      message.success("Đặt vé thành công!");
      console.log(response.data);
    },
    onError: (error) => {
      console.error(error); // Log lỗi nếu có
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
      return false; // Trả về false nếu thông tin không hợp lệ
    }

    const orderToSubmit = {
      movieId: orderData.movieId,
      movieName: orderData.movieName,
      projectionRoomId: orderData.projectionRoomId,
      roomName: orderData.roomName,
      seats: orderData.seats.map((seat) => seat.name),
      showtime: orderData.showtime,
      theaterId: orderData.theaterId,
      theaterName: orderData.theaterName,
      userId: userId,
    };

    confirmOrderMutation.mutate(orderToSubmit);
    return true; 
  };

  if (isUserLoading) {
    return <p>Đang tải thông tin khách hàng...</p>;
  }
  const handleConfirmAndPay = async () => {
    const isOrderConfirmed = handleConfirmOrder();

    if (isOrderConfirmed) {
      await handlePayment();
    }
  };

  return (
    <div className="container mx-auto mb-20 mt-40 px-[10%] flex flex-row text-white">
      <div className="flex flex-col w-[45%]">
        <h2 className="text-3xl font-bold mb-6 tracking-wider self-center">
          THANH TOÁN VÀ XÁC NHẬN
        </h2>
        {/* Thông tin khách hàng */}
        <div className="bg-[#111] p-4 rounded mb-6">
          <h3 className="text-lg font-bold mb-4">1. Thông tin khách hàng</h3>
          <div className="mb-4">
            <label className="block text-white mb-2">Họ và tên *</label>
            <input
              type="text"
              name="fullName"
              value={customerInfo.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#dadada] text-black rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Số điện thoại *</label>
            <input
              type="text"
              name="phoneNumber"
              value={customerInfo.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#dadada] text-black rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-[#dadada] text-black rounded"
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
            <span className="text-white">
              Đồng ý với{" "}
              <a href="#terms" className="text-yellow-500">
                điều khoản của MeetFlix
              </a>
            </span>
          </div>
        </div>
        <button
          className=" font-bold py-2 text-xl tracking-widest mt-4 bg-black text-yellow-600 border border-yellow-600 rounded shadow hover:bg-yellow-600 hover:text-black transition"
          onClick={handleConfirmAndPay}
          disabled={confirmOrderMutation.isLoading}
        >
          {confirmOrderMutation.isLoading ? "Đang xử lý..." : "Tiếp tục"}
        </button>
      </div>
      <div className="flex flex-col w-[55%] mx-6 p-5 bg-yellow-600 relative">
        <img
          src={bgImage}
          alt="Background"
          className="absolute right-0 bottom-0 w-[100%] h-[100%] bg-cover z-0 opacity-15"
        />
        {/* Step 3: Ticket Information */}
        <h3 className="text-3xl text-black font-bold mb-4 mt-4 uppercase self-center tracking-wider">
          THÔNG TIN VÉ PHIM
        </h3>
        <div className="text-xl flex flex-col space-y-4 mt-4 ml-2">
          <p className="text-black mb-2">
            <strong>Phim:</strong> {orderData?.movieName || "N/A"}
          </p>
          <p className="text-black mb-2">
            <strong>Rạp:</strong> {orderData?.theaterName || "N/A"}
          </p>
          <p className="text-black mb-2">
            <strong>Phòng chiếu:</strong> {orderData?.roomName || "N/A"}
          </p>
          <p className="text-black mb-2">
            <strong>Thời gian:</strong>{" "}
            {moment(orderData?.showtime).format("DD/MM/YYYY HH:mm") || "N/A"}
          </p>
          <p className="text-black mb-2">
            <strong>Số ghế:</strong>{" "}
            {orderData?.seats?.map((seat) => seat.name).join(", ") || "N/A"}
          </p>
        </div>

        <div className="h-[1px] my-4 w-[94%] self-center bg-black absolute bottom-20" />
        <p className="text-black mb-4 text-2xl self-center font-medium tracking-wide absolute bottom-6">
          <strong>Tổng hóa đơn:</strong> {totalBill.toLocaleString()} VND
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;
