export const findTotalSalaryAmt = (data) => {
    let totalSalary = 0
    totalSalary += (data?.allowed_salary || 0) + (data?.for_round_amount || 0)

    data?.allowance?.map((item) => {
        totalSalary += item.amount || 0
        return item
    })

    data?.incentive?.map((item) => {
        totalSalary += item.amount || 0
        return item
    })

    return totalSalary
}

