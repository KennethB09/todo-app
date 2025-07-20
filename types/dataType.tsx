export interface UserData {
  todos: todo[];
  tasks: task[];
  notifications: notification[];
}

// 1 = sunday, 2 = monday, etc.
export type day = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface task {
  todoId: string;
  id: string;
  name: string;
  isChecked: boolean;
  taskType: "simple" | "scheduled";
  dueDate?: {
    enabled: boolean;
    date: Date;
  }
  completionTime?: {
    enabled: boolean;
    start: Date;
    end: Date;
  };
  reminder?: {
    enabled: boolean;
    remind: number;
  };
  repeat?: day[];
}

export interface todo {
  id: string;
  title: string;
  bg: string;
}

export interface notification {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

export type Ttheme = {
  background: string;
  pink: string;
  labelColor: string;
  labelInfo: string;
  listInfo: string;
  white: string;
  fwMedium: number;
  fwRegular: number;
  fontSizeNumber: number;
  fonstSizeTitle: number;
  fontSizeEX: number;
  fontSizeL: number;
  fontSizeML: number;
  fontSizeM: number;
  fontSizeS: number;
  fontFamily: string;
  textColor: string;
  pallete: {
    pink: string;
    dark: string;
    light: string;
    darkGray: string;
    gray: string;
    lightGray: string;
  };
  fontColor: {
    primary: string;
    secondary: string;
    tertiary: string;
    white: string;
    pink: string;
  };
};

export type TpastelTheme = {
  background: string[];
};

export type TconvertDay = {
  [key: string]: day;
  sunday: day;
  monday: day;
  tuesday: day;
  wednesday: day;
  thursday: day;
  friday: day;
  saturday: day;
};