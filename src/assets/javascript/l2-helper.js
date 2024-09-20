const readTheLetters = (data = []) => {
    let letters = data.map((letter) => {
        const requested = letter.requested_days.sort((a, b) => a[0] - b[0]) || []
        const approved = letter.approved_days.sort((a, b) => a[0] - b[0]) || []


        let edited = false

        for (let i = 0; i < requested.length; i++) {
            const element = requested[i];

            if (letter.leave_status === 'Approved' &&
                (!approved[i] || element[0] !== approved[i][0] || element[1] !== approved[i][1] || element[2] !== approved[i][2] || element[3] !== approved[i][3])) {
                edited = true
                break;
            }
        }

        return {
            ...letter,
            requested_days: requested,
            approved_days: approved,
            edited
        }
    })

    return letters

}

export { readTheLetters }