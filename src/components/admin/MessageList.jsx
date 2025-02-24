import React from 'react';
import { List, Card } from 'antd';

const MessageList = ({ messages }) => {
  return (
    <Card title="Messages">
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={messages}
        renderItem={item => (
          <List.Item>
            <Card title={item.title}>
              <p>Content: {item.content}</p>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default MessageList;