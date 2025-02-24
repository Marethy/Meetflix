import React from 'react';
import { Breadcrumb } from 'antd';

const BreadcrumbNav = ({ selectedMenuItem }) => {
  const breadcrumbItems = [
    { title: 'Dashboard' },
    { title: selectedMenuItem === '2' ? 'Movies' : selectedMenuItem === '1' ? 'User' : 'Home' },
  ];

  return (
    <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
  );
};

export default BreadcrumbNav;