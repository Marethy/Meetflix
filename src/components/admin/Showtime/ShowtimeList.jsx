import React from 'react';
import { List, Card } from 'antd';

const ShowtimeList = ({ showtimes }) => {
  return (
    <Card title="Showtimes">
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={showtimes}
        renderItem={item => (
          <List.Item>
            <Card title={item.title}>
              <p>Start Time: {item.start_time}</p>
              <p>End Time: {item.end_time}</p>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ShowtimeList;