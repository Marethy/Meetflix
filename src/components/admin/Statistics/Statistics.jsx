import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Spin, message } from "antd";
import { UserOutlined, DollarOutlined, FileDoneOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { StatisticApi } from "../../../api";  
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';  // Recharts import

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    totalMovies: 0,
    totalScreeningMovies: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
  
      try {
        // Fetch statistics from API
        const data = await StatisticApi.getStatistic();

        // Update statistics state with API data
        setStatistics({
          totalUsers: data.userCount,
          totalTicketsSold: data.totalTicketSold,
          totalRevenue: data.revenue,
          totalMovies: data.totalMovies,
          totalScreeningMovies: 0, // Assuming you will calculate this from movies if needed
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

  // Data for charts
  const generalStatsData = [
    { name: 'Users', value: statistics.totalUsers },
    { name: 'Tickets Sold', value: statistics.totalTicketsSold },
    { name: 'Movies', value: statistics.totalMovies },
    { name: 'Screening Movies', value: statistics.totalScreeningMovies },
  ];

  const revenueData = [
    { name: 'Total Revenue', value: statistics.totalRevenue },
  ];

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

      {/* Chart for General Stats (Users, Tickets, Movies, Screening Movies) */}
      <div style={{ marginTop: '20px', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={generalStatsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart for Revenue */}
      <div style={{ marginTop: '20px', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;
