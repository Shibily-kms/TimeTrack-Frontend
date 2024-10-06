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
        return task;
    })

    return { overdue, update, completed }

}

export const nextSevenDayDataCategories = (array) => {
    const result = {}

    array.map((task) => {
        if (task?.status === -1 || task?.status === 2) {
            if (!result['completed']) {
                result['completed'] = [];
            }
            result['completed'].push(task);
        } else if (task?.due_date && YYYYMMDDFormat(new Date(task?.due_date)) >= YYYYMMDDFormat(new Date())) {
            const dueDateKey = YYYYMMDDFormat(new Date(task?.due_date));
            if (!result[dueDateKey]) {
                result[dueDateKey] = [];
            }
            result[dueDateKey].push(task);
        }
        return task;
    })

    return result;
}

export const allTodoCategories = (array) => {
    const result = array.filter((todo) => todo.status === 1)
    return result
}

export const removedTodoCategories = (array) => {
    const result = array.filter((todo) => todo.deleted_by)
    return result
}