const readTheLetters = (data = []) => {
    let letters = data.map((letter) => {
        const requested = letter.requested_days?.sort((a, b) => a[0] - b[0]) || []
        const approved = letter.approved_days?.sort((a, b) => a[0] - b[0]) || []
        let requested_days = 0
        let requested_half = 0
        let approved_days = 0
        let approved_half = 0


        let edited = false

        for (let i = 0; i < requested.length; i++) {
            const element = requested[i];

            if (letter.leave_status === 'Approved' &&
                (!approved[i] || element[0] !== approved[i][0] || element[1] !== approved[i][1] || element[2] !== approved[i][2] || element[3] !== approved[i][3])) {
                edited = true
                break;
            }
        }

        // Leave Count Requested
        if (letter?.requested_days?.length > 1) {
            requested_days = letter?.requested_days?.length
        } else if (letter?.requested_days?.[0]?.[1] < 1) {
            requested_days = .5
            if (letter?.requested_days?.[0]?.[2] === '09:30') {
                requested_half = 1
            } else {
                requested_half = 2
            }
        } else {
            requested_days = 1
        }

        // Leave count approve
        if (letter.leave_status === 'Approved') {
            if (letter?.approved_days?.length > 1) {
                approved_days = letter?.approved_days?.length
            } else if (letter?.approved_days?.[0]?.[1] < 1) {
                approved_days = .5
                if (letter?.approved_days?.[0]?.[2] === '09:30') {
                    approved_half = 1
                } else {
                    approved_half = 2
                }
            } else {
                approved_days = 1
            }
        }


        return {
            ...letter,
            requested_days: requested,
            requested_count: requested_days,
            requested_half: requested_half,
            approved_days: approved,
            approved_count: approved_days,
            approved_half: approved_half,
            edited
        }
    })

    return letters

}

export { readTheLetters }