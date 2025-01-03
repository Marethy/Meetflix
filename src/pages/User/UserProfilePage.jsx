import React from "react";
import { useQuery } from "@tanstack/react-query";
import { UserApi } from "../../api";

const UserProfilePage = () => {
  const userId = localStorage.getItem("userId");

  const {
    data: userInfo,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => UserApi.getUser(userId),
    staleTime: 5 * 60 * 1000,
  });

  // const {
  //   data: userOrders,
  //   isLoading: isOrdersLoading,
  //   error: ordersError,
  // } = useQuery({
  //   queryKey: ["userOrders", userId],
  //   queryFn: () => UserApi.getOrderbyUserId(userId),
  //   staleTime: 5 * 60 * 1000,
  // });

  // Xử lý trạng thái tải thông tin người dùng
  if (isUserLoading) return <p>Đang tải thông tin người dùng...</p>;
  if (userError) return <p>Đã xảy ra lỗi khi tải thông tin người dùng: {userError.message}</p>;

  // Xử lý trạng thái tải lịch sử đặt vé
  // if (isOrdersLoading) return <p>Đang tải lịch sử đặt vé...</p>;
  // if (ordersError) return <p>Đã xảy ra lỗi khi tải lịch sử đặt vé: {ordersError.message}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-16 text-black">
      <h1 className="text-3xl font-bold mb-6">Thông Tin Người Dùng</h1>
      <div className="bg-white p-4 rounded shadow-md">
        <p><strong>Họ và tên:</strong> {userInfo?.fullName || "Chưa cập nhật"}</p>
        <p><strong>Email:</strong> {userInfo?.email || "Chưa cập nhật"}</p>
        <p><strong>Số điện thoại:</strong> {userInfo?.phoneNumber || "Chưa cập nhật"}</p>
        <p><strong>Ngày sinh:</strong> {userInfo?.birthday || "Chưa cập nhật"}</p>
        <p><strong>Tên đăng nhập:</strong> {userInfo?.username || "Chưa cập nhật"}</p>
      </div>

      {/* Lịch sử đặt vé */}
      {/* <h2 className="text-2xl font-bold mt-8 mb-4">Lịch Sử Đặt Vé</h2>
      {userOrders?.length === 0 ? (
        <p>Không có lịch sử đặt vé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userOrders?.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded shadow-md">
              <p><strong>Phim:</strong> {order.movie}</p>
              <p><strong>Thời gian chiếu:</strong> {order.startTime}</p>
              <p><strong>Rạp:</strong> {order.theater}</p>
              <p><strong>Phòng chiếu:</strong> {order.projectionRoom}</p>
              <p><strong>Ghế:</strong> {order.seats?.join(", ")}</p>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default UserProfilePage;
