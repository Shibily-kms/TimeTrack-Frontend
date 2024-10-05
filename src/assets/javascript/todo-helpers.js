import { YYYYMMDDFormat } from "./date-helper"

export const todayDataCategories = (array) => {

    const overdue = [], update = [], completed = []

    array.map((task) => {
        if (task?.status === -1 || task?.status === 2) {
            completed.push(task)
        } else if (task?.due_date && YYYYMMDDFormat(new Date(task?.due_date)) < YYYYMMDDFormat(new Date())) {
            overdue.push(task)
        } else {
            update.push(task)
        }
        return;
    })

    return { overdue, update, completed }

}