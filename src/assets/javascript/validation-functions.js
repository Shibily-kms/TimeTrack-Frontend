export const createStaffFormValidation = (data) => {
    if (data.first_name[0] === ' ' || data.last_name[0] === ' ' || data.sid[0] === ' ' || data.current_working_time[0] === ' ') {
        return ['error', 'Space is not accepted as the first character']
    }

    if (data?.primary_number?.number < 7) {
        return ['error', 'Enter valid Primary number formate']
    }
    return false
}