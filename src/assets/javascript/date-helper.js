function stringToLocalTime(time = '', ifSecond = false) {    // 14:15:23  ==> 02:15 PM
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

const YYYYMMDDFormat = (ISOdate, symbol = '-') => {
    symbol = symbol ? symbol : ''
    const year = ISOdate.getFullYear();
    const month = String(ISOdate.getMonth() + 1).padStart(2, '0');
    const day = String(ISOdate.getDate()).padStart(2, '0');

    return `${year}${symbol}${month}${symbol}${day}`;
}

const getTimeFromSecond = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    let time = ''
    if (hours) {
        time = `${hours}h `
    }
    if (minutes) {
        time = time + `${minutes}m`
    }
    return time;
}



export { stringToLocalTime, YYYYMMDDFormat, getTimeFromSecond }