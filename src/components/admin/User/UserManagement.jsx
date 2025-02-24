import React, { useState } from "react";
import {
  Button,
  Popconfirm,
  Form,
  Input,
  Select,
  Spin,
  message,
  Modal,
  Table,
  DatePicker,
  Switch,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "../../../api";
import moment from "moment";

const UserManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: UserApi.getAllUser,
  });

  const createUserMutation = useMutation({
    mutationFn: UserApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      message.success("User created successfully");
      form.resetFields();
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        const { message: errorMessage } = error.response.data;
        message.error(`Failed to create user: ${errorMessage}`);
      } else {
        message.error("Failed to create user due to a network error");
      }
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }) => UserApi.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      message.success("User updated successfully");
      form.resetFields();
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        const { message: errorMessage } = error.response.data;
        message.error(`Failed to update user: ${errorMessage}`);
      } else {
        message.error("Failed to update user due to a network error");
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: UserApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      message.success("User deleted successfully");
    },
    onError: () => {
      message.error("Failed to delete user");
    },
  });

  const showModal = (user = null) => {
    setSelectedUser(user);
    if (user) {
      form.setFieldsValue({
        ...user,
        roles: user.roles.map((role) => role.name),
        birthday: user.birthday ? moment(user.birthday) : null,
        is_active: !!user.is_active,
      });
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        username: values.username,
        password: values.password || "default_password",
        email: values.email,
        roles: values.roles.map((role, index) => ({
          id: index + 1, // Tạm giả định ID role tự tăng.
          name: role,
        })),
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        movie_ids: values.movie_ids || [],
        active: values.is_active ?? false,
      };

      if (selectedUser) {
        updateUserMutation.mutate({
          userId: selectedUser.id,
          userData: payload,
        });
      } else {
        createUserMutation.mutate(payload);
      }

      setIsModalVisible(false);
      setSelectedUser(null);
    } catch (error) {
      console.log(error);
      message.error("Failed to save user");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const handleDelete = (id) => {
    try {
      deleteUserMutation.mutate(id);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles) => roles.map((role) => role.name).join(", "),
      sorter: (a, b) => {
        const rolesA = a.roles.map((role) => role.name).join(", ");
        const rolesB = b.roles.map((role) => role.name).join(", ");
        return rolesA.localeCompare(rolesB);
      },
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },

    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Birthday",
      dataIndex: "birthday",
      key: "birthday",
      render: (birthday) => (birthday ? moment(birthday).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (is_active ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => showModal(record)}
            style={{ marginRight: "10px" }}
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="bg-red-700 text-white">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-100">
      <Button type="primary" onClick={() => showModal()} className="mb-6">
        Add User
      </Button>
      <Modal
        title={selectedUser ? "Update User" : "Add User"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please input the user name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="roles"
            label="Roles"
            rules={[
              { required: true, message: "Please select at least one role!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select roles"
              options={[
                { label: "Admin", value: "ADMIN" },
                { label: "User", value: "USER" },
                { label: "Guest", value: "GUEST" },
                { label: "Manager", value: "Manager" },

              ]}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the user email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input the username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="birthday" label="Date of Birth">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      {loadingUsers ? (
        <Spin tip="Loading users..." />
      ) : (
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1000 }}
        />
      )}
    </div>
  );
};

export default UserManagement;
