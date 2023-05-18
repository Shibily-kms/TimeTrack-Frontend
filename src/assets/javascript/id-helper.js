function createRandomId(sting_length, addition = "") {
    const numbers = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let randomString = '';
    for (let i = 0; i < sting_length; i++) {
        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
    return addition + randomString
}


export { createRandomId }