import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { notification } from 'antd';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  reminderDate: Date | null; // Updated to handle specific date and time
}

interface TodosState {
  list: Todo[];
  pending: Todo[];
}

const initialState: TodosState = {
  list: [],
  pending: [],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<{ title: string; description: string; reminderDate: Date | null }>) => {
      const newTodo: Todo = {
        id: new Date().toISOString(),
        title: action.payload.title,
        description: action.payload.description,
        completed: false,
        reminderDate: action.payload.reminderDate,
      };
      state.list.push(newTodo);
      notification.success({ message: 'Todo added!', description: 'Your task has been added.' });
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(todo => todo.id !== action.payload);
    },
    markAsCompleted: (state, action: PayloadAction<string>) => {
      const todo = state.list.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = true;
        notification.success({ message: 'Task completed!', description: 'You have completed the task.' });
        state.list = state.list.filter(todo => todo.id !== action.payload);
      }
    },
    moveToPending: (state, action: PayloadAction<string>) => {
      const todo = state.list.find(todo => todo.id === action.payload);
      if (todo && !todo.completed) {
        state.pending.push(todo);
        state.list = state.list.filter(todo => todo.id !== action.payload);
        notification.warning({ message: 'Task moved to pending!', description: 'The task has been moved to the pending list.' });
      }
    },
    incrementReminderTime: (state, action: PayloadAction<{ id: string; incrementMillis: number }>) => {
      const todo = state.list.find(todo => todo.id === action.payload.id);
      if (todo && todo.reminderDate) {
        todo.reminderDate = new Date(todo.reminderDate.getTime() + action.payload.incrementMillis);
        notification.info({ message: 'Reminder time updated!', description: 'The reminder time has been incremented.' });
      }
    },
  },
});

export const { addTodo, removeTodo, markAsCompleted, moveToPending, incrementReminderTime } = todosSlice.actions;

export default todosSlice.reducer;
