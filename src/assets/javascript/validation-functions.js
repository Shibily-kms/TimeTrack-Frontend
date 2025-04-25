export const createStaffFormValidation = (data) => {
    if (data.first_name[0] === ' ' || data.last_name[0] === ' ' || data.sid[0] === ' ' || data.current_working_time[0] === ' ') {
        return ['error', 'Space is not accepted as the first character']
    }

    if (data?.primary_number?.number < 7) {
        return ['error', 'Enter valid Primary number formate']
    }
    return false
}

export const prospectCUValidation = (data) => {
    const textRegex = /^[A-Za-z0-9\s]*$/;
    const letterRegex = /^[A-Za-z\s]*$/;


    if (!letterRegex.test(data?.first_name)) {
        return [false, 'First name can only contain letters']
    }
    if (!letterRegex.test(data?.last_name)) {
        return [false, 'Last name can only contain letters']
    }
    if (!textRegex.test(data?.address)) {
        return [false, 'Address can only contain letters']
    }
    if (!textRegex.test(data?.place)) {
        return [false, 'Place can only contain letters']
    }
    if (!textRegex.test(data?.land_mark)) {
        return [false, 'Land mark can only contain letters']
    }

    return [true]

}