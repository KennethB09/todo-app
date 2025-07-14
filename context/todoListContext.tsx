import React, {
  useReducer,
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
} from "react";
import { todo, task, UserData, notification } from "@/types/dataType";

type TuserDataAction =
  | { type: "SET_DATA"; payload: UserData }
  | { type: "CHECK_TASK"; payload: string }
  | { type: "ADD_TASK"; payload: task }
  | { type: "EDIT_TASK"; payload: task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "CREATE_TODO"; payload: todo }
  | { type: "UPDATE_TODO"; payload: todo }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "SET_NOTIFICATIONS"; payload: notification[] }
  | { type: "ADD_NOTIFICATION"; payload: notification }
  | { type: "DELETE_NOTIFICATION"; payload: string };

type TuserDataState = {
  userData: UserData;
};

type TuserDataContext = {
  userData: UserData;
  dispatch: Dispatch<TuserDataAction>;
};

const todoListContext = createContext<TuserDataContext | undefined>(undefined);

const todoListReducer = (
  state: TuserDataState,
  action: TuserDataAction
): TuserDataState => {
  switch (action.type) {
    case "SET_DATA":
      return {
        userData: action.payload,
      };
    case "CHECK_TASK":
      return {
        userData: {
          ...state.userData,
          tasks: state.userData.tasks.map((task) =>
            task.id === action.payload
              ? { ...task, isChecked: !task.isChecked }
              : task
          ),
        },
      };
    case "ADD_TASK":
      return {
        userData: {
          ...state.userData,
          tasks: [action.payload, ...state.userData.tasks],
        },
      };
    case "EDIT_TASK":
      return {
        userData: {
          ...state.userData,
          tasks: state.userData.tasks.map((task) =>
            task.id === action.payload.id ? action.payload : task
          ),
        },
      };
    case "DELETE_TASK":
      return {
        userData: {
          ...state.userData,
          tasks: state.userData.tasks.filter(
            (task) => task.id !== action.payload
          ),
        },
      };
    case "CREATE_TODO":
      return {
        userData: {
          ...state.userData,
          todos: [action.payload, ...state.userData.todos],
        },
      };
    case "UPDATE_TODO":
      return {
        userData: {
          ...state.userData,
          todos: state.userData.todos.map((todo) =>
            todo.id === action.payload.id ? action.payload : todo
          ),
        },
      };
    case "DELETE_TODO":
      return {
        userData: {
          ...state.userData,
          todos: state.userData.todos.filter((e) => e.id !== action.payload),
        },
      };
    case "SET_NOTIFICATIONS":
      return {
        userData: {
          ...state.userData,
          notifications: action.payload,
        },
      };
    case "ADD_NOTIFICATION":
      return {
        userData: {
          ...state.userData,
          notifications: [action.payload, ...state.userData.notifications],
        },
      };
    case "DELETE_NOTIFICATION":
      return {
        userData: {
          ...state.userData,
          notifications: state.userData.notifications.filter(
            (n) => n.id !== action.payload
          ),
        },
      };
    default:
      return state;
  }
};

function useTodoListData(): TuserDataContext {
  const context = useContext(todoListContext);
  if (!context) {
    throw new Error("todoContext must be used within an todoProvider.");
  }
  return context;
}

const TodoListDataProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const [state, dispatch] = useReducer(todoListReducer, {
    userData: {
      todos: [],
      tasks: [],
      notifications: [],
    },
  });

  return (
    <todoListContext.Provider value={{ ...state, dispatch }}>
      {children}
    </todoListContext.Provider>
  );
};

export { TodoListDataProvider, useTodoListData };
