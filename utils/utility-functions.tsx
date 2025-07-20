import { task, TconvertDay } from "@/types/dataType";
import { format } from "date-fns/format";

export const CONVERT_DAYS: TconvertDay = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7,
};

export function filterTasksForToday(tasks: task[], today = new Date()) {
  const todayDay = today
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();

  const dueDateTask = tasks.filter(
    (t) =>
      t.taskType === "scheduled" &&
      t.dueDate?.enabled &&
      format(t.dueDate.date, "MM/dd/yyyy") === format(today, "MM/dd/yyyy")
  );
  const repeatTask = tasks.filter(
    (t) =>
      t.taskType === "scheduled" &&
      !t.dueDate?.enabled &&
      t.repeat?.includes(CONVERT_DAYS[todayDay])
  );
  const simpleTask = tasks.filter((t) => t.taskType === "simple");

  return [...dueDateTask, ...repeatTask, ...simpleTask];
}