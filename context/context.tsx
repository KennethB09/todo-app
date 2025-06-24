import React, { createContext, Dispatch, ReactElement, ReactNode, SetStateAction, useContext, useState } from "react";
import { todo } from "@/types/dataType";

type todoData = {
    data: todo | null
    setData: Dispatch<SetStateAction<todo | null>>
}

const todoContext = createContext<todoData | undefined>(undefined);

function useTodo(): todoData {
    const context = useContext(todoContext)

    if (!context) {
        throw new Error("todoContext must be used within an todoProvider.")
    }

    return context
}

const TodoProvider = ({children}: { children: ReactNode }): ReactElement => {
    const [data, setData] = useState<todo | null>(null);

    return (
    <todoContext.Provider value={{ data, setData }}>
        {children}
    </todoContext.Provider>
    )
}

export { TodoProvider, useTodo }