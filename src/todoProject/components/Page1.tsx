import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addTodo, removeTodo, markAsCompleted, moveToPending, incrementReminderTime } from '../slice/TodoSlice';
import { Button, Input, List, notification, Typography, Form, DatePicker } from 'antd';
import 'antd/dist/reset.css';
import dayjs from 'dayjs';

const { Title } = Typography;

const Page1: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.list);
  const pending = useSelector((state: RootState) => state.todos.pending);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [reminderDate, setReminderDate] = useState<Date | null>(null);

  console.log((reminderDate));
  

  const handleAddTodo = () => {
    if (title && description) {
      dispatch(addTodo({ title, description, reminderDate }));
      setTitle('');
      setDescription('');
      setReminderDate(null);
    }
  };

  const handleMarkAsCompleted = (id: string) => {
    dispatch(markAsCompleted(id));
  };

  const handleMoveToPending = (id: string) => {
    dispatch(moveToPending(id));
  };

  const handleIncrementReminder = (id: string) => {
    dispatch(incrementReminderTime({ id, incrementMillis: 3600000 })); // Increment by 1 hour
    notification.info({
      message: 'Reminder Time Updated',
      description: `Reminder time for task with ID ${id} has been incremented by 1 hour.`,
    });
  };

  const onDateChange = (date: any, dateString: string) => {
    if (date) {
      setReminderDate(dayjs(dateString).toDate());
    } else {
      setReminderDate(null);
    }
  };

  // Check for overdue tasks and show notifications
  useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      console.log("now",now);
      
      todos.forEach(todo => {
        if (todo.reminderDate && !todo.completed && now >= new Date(todo.reminderDate)) {
            const test = new Date(todo.reminderDate)
            console.log(test);
          notification.warning({
            message: 'Task Overdue',
            description: `Task "${todo.title}" is overdue!`,
            onClick: () => {
              // Optional: Redirect or handle the click event
            }
          });
        }
      });
    };

    // Check every minute
    const intervalId = setInterval(checkOverdueTasks, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [todos]);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Todo List</Title>
      <Form layout="inline">
        <Form.Item>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <DatePicker onChange={onDateChange} showTime />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAddTodo}>Add Todo</Button>
        </Form.Item>
      </Form>
      <Title level={3}>Tasks</Title>
      <List
        bordered
        dataSource={todos}
        renderItem={item => (
          <List.Item
            actions={[
              <Button onClick={() => handleMarkAsCompleted(item.id)}>Complete</Button>,
              <Button onClick={() => handleMoveToPending(item.id)}>Move to Pending</Button>,
              <Button onClick={() => handleIncrementReminder(item.id)}>Increase Reminder</Button>
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={item.description}
            />
            {item.reminderDate && (
              <div>Reminder: {item.reminderDate.toLocaleString()}</div>
            )}
          </List.Item>
        )}
      />
      <Title level={3}>Pending Tasks</Title>
      <List
        bordered
        dataSource={pending}
        renderItem={item => (
          <List.Item
            actions={[
              <Button onClick={() => handleIncrementReminder(item.id)}>Increase Reminder</Button>
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={item.description}
            />
            {item.reminderDate && (
              <div>Reminder: {item.reminderDate.toLocaleString()}</div>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default Page1;
