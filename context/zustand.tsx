import { create } from "zustand";
import { todo, task, UserData } from "@/types/dataType";

type TuserDataState = {
  userData: UserData;
  setData: (data: UserData) => void;
  checkTask: (id: string) => void;
  addTask: (task: task) => void;
  editTask: (task: task) => void;
  deleteTask: (id: string) => void;
  createTodo: (todo: todo) => void;
  updateTodo: (todo: todo) => void;
  deleteTodo: (id: string) => void;
};

export const useTodoListStore = create<TuserDataState>((set, get) => ({
  userData: {
    todos: [],
    tasks: []
  },
  setData: (data) =>
    set(() => ({
      userData: data,
    })),
  checkTask: (id) =>
    set((state) => ({
      userData: {
        ...state.userData,
        tasks: state.userData.tasks.map((task) =>
          task.id === id ? { ...task, isChecked: !task.isChecked } : task
        ),
      },
    })),
  addTask: (task) =>
    set((state) => ({
      userData: {
        ...state.userData,
        tasks: [task, ...state.userData.tasks],
      },
    })),
  editTask: (task) =>
    set((state) => ({
      userData: {
        ...state.userData,
        tasks: state.userData.tasks.map((t) =>
          t.id === task.id ? task : t
        ),
      },
    })),
  deleteTask: (id) =>
    set((state) => ({
      userData: {
        ...state.userData,
        tasks: state.userData.tasks.filter((task) => task.id !== id),
      },
    })),
  createTodo: (todo) =>
    set((state) => ({
      userData: {
        ...state.userData,
        todos: [todo, ...state.userData.todos],
      },
    })),
  updateTodo: (todo) =>
    set((state) => ({
      userData: {
        ...state.userData,
        todos: state.userData.todos.map((t) =>
          t.id === todo.id ? todo : t
        ),
      },
    })),
  deleteTodo: (id) =>
    set((state) => ({
      userData: {
        ...state.userData,
        todos: state.userData.todos.filter((t) => t.id !== id),
        tasks: state.userData.tasks.filter((t) => t.todoId !== id)
      },
    }))
}));