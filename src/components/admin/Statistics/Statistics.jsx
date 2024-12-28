import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Spin, message } from "antd";
import { UserOutlined, DollarOutlined, FileDoneOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { UserApi, MovieApi } from "../../../api";  // Import các API

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalUsers: 20,
    totalTicketsSold: 12,
    totalRevenue: "123.000.00",
    totalMovies: 32,
    totalScreeningMovies: 12, 
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        
        // Lấy tổng số người dùng
        const userData = await UserApi.getAllUser(); 
        const totalUsers = userData.length;  
        
        // Lấy tổng số vé đã bán
        const ticketData = await TicketApi.getAllTickets();  // Lấy danh sách vé
        const totalTicketsSold = ticketData.length;  // Đếm số lượng vé bán
        
        // Lấy tổng doanh thu
        const totalRevenue = ticketData.reduce((acc, ticket) => acc + ticket.price, 0);  // Tính tổng doanh thu từ giá vé
        
        // Lấy tổng số phim
        const movieData = await MovieApi.getMovies();  // Lấy danh sách phim
        const totalMovies = movieData.length;  // Đếm tổng số phim
        
        // Lấy tổng số phim đang chiếu
        const screeningMovies = movieData.filter(movie => movie.status === "playing");  // Lọc các phim đang chiếu
        const totalScreeningMovies = screeningMovies.length;

        // Cập nhật vào state
        setStatistics({
          totalUsers,
          totalTicketsSold,
          totalRevenue,
          totalMovies,
          totalScreeningMovies,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
        message.error("Failed to load statistics data");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <Spin size="large" style={{ display: "block", textAlign: "center", marginTop: "50px" }} />;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={statistics.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số vé bán"
              value={statistics.totalTicketsSold}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={statistics.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#cf1322" }}
              suffix="VND"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số phim"
              value={statistics.totalMovies}
              prefix={<FileDoneOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Phim đang chiếu"
              value={statistics.totalScreeningMovies}
              prefix={<FileDoneOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
