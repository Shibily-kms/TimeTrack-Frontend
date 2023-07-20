function stringToLocalTime(time = '', ifSecond = false) {    // 02:15:23  ==> 02:15 PM
    if (!time) {
        return 
    }
    const [hours, minutes, seconds] = time.split(':')
    const suffix = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
    let hours12Format = (parseInt(hours, 10) % 12) || 12;
    hours12Format = hours12Format < 10 ? `0${hours12Format}` : hours12Format

    if (seconds && ifSecond) {
        return `${hours12Format}:${minutes}:${seconds} ${suffix}`;
    }
    return `${hours12Format}:${minutes} ${suffix}`;
}




export { stringToLocalTime }