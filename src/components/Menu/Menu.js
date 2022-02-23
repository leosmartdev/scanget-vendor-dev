import React from 'react';
import { Menu, Icon } from 'antd';
import PropTypes from 'prop-types';

// Sider Menu Component
const SideMenu = ({ onMenuSelect }) => {
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['1']}
      onSelect={({ key }) => { onMenuSelect(key); }}
      selectedKeys={[window.location.pathname]}
    >
      <Menu.Item key="/dashboard">
        <Icon type="pie-chart" />
        <span>Dashboard</span>
      </Menu.Item>
      <Menu.Item key="/dashboard/communities">
        <Icon type="user" />
        <span>Community</span>
      </Menu.Item>
      <Menu.Item key="/dashboard/packages">
        <Icon type="gift" />
        <span>Packages</span>
      </Menu.Item>
      <Menu.Item key="/dashboard/products">
        <Icon type="inbox" />
        <span>Products</span>
      </Menu.Item>
      <Menu.Item key="/dashboard/deals">
        <Icon type="shopping-cart" />
        <span>Deals</span>
      </Menu.Item>
      <Menu.Item key="/dashboard/promotions">
        <Icon type="notification" />
        <span>Promotions</span>
      </Menu.Item>
      <Menu.Item key="/dashboard/profile">
        <Icon type="user" />
        <span>Profile</span>
      </Menu.Item>
      {/* <Menu.Item key="/dashboard/packages">
        <Icon type="star" />
        <span>Packages</span>
      </Menu.Item> */}
    </Menu>
  );
}

SideMenu.propTypes = {
  onMenuSelect: PropTypes.func
}

export default SideMenu;