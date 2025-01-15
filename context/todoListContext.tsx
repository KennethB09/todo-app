import React, { useReducer, createContext, Dispatch, ReactElement, ReactNode, SetStateAction, useContext } from "react";
import { todoList, Tlist } from "@/app/(screens)";

type TtodoDataAction =
    | { type: "SET_DATA"; payload: todoList[] }
    | { type: "UPDATE_DATA"; payload: todoList }
    | { type: "CREATE_DATA"; payload: todoList }
    | { type: "DELETE_DATA"; payload: number | string }
    | { type: "ARCHIVE_DATA"; payload: { todo: number | string, type: "archive" | "todo" } }

type TodoState = {
    todoList: todoList[] | [];
}

type TtodoDataContext = {
    todoList: todoList[] | [];
    dispatch: Dispatch<TtodoDataAction>;
}

const todoListContext = createContext<TtodoDataContext | undefined>(undefined);

const todoListReducer = (state: TodoState, action: TtodoDataAction): TodoState => {
    switch (action.type) {
        case "SET_DATA":
            return {
                todoList: action.payload
            }
        case "UPDATE_DATA":
            return {
                todoList: state.todoList?.map(e => 
                    e.id === action.payload.id
                        ? e = action.payload
                        : e
                ) || null
            }
        case "CREATE_DATA":
            return {
                todoList: [action.payload, ...state.todoList!]
            }
        case "DELETE_DATA":
            return {
                todoList: state.todoList?.filter(e => e.id !== action.payload)
            }
        case "ARCHIVE_DATA":
            return {
                todoList: state.todoList?.map(e => 
                    e.id === action.payload.todo
                        ? { ...e, type: action.payload.type }
                        : e
                ) || null
            }
        default:
            return state;
    }
}

function useTodoListData(): TtodoDataContext {
    const context = useContext(todoListContext);
    if (!context) {
        throw new Error("todoContext must be used within an todoProvider.");
    }
    return context;
}

const TodoListDataProvider = ({ children }: { children: ReactNode }): ReactElement => {
    const [state, dispatch] = useReducer(todoListReducer, {
        todoList: []
    });

    return (
        <todoListContext.Provider value={{ ...state, dispatch }}>
            {children}
        </todoListContext.Provider>
    );
}

export { TodoListDataProvider, useTodoListData };