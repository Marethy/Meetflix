import React from 'react';
import { Card } from 'antd';

const UserDetail = ({ user }) => {
  return (
    <Card title="User Details">
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </Card>
  );
};

export default UserDetail;