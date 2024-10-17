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
    const year = ISOdate?.getFullYear();
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

const secondsToHHMM = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

function TimeBasedGreeting() {
    // Get the current hour
    const hour = new Date().getHours();
    let greeting;

    // Determine the greeting based on the current hour
    if (hour < 12) {
        greeting = 'Good Morning';
    } else if (hour < 15) {
        greeting = 'Good Afternoon';
    } else if (hour < 19) {
        greeting = 'Good Evening';
    } else {
        greeting = 'Good Night';
    }

    // Render the greeting
    return greeting;
}

function convertIsoToAmPm(isoString) {
    // Parse the ISO string into a Date object
    const date = new Date(isoString);

    // Get hours, minutes, and seconds
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Format hours for AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Pad minutes and seconds with leading zeros if needed
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  

    // Combine parts
    return `${hours}:${minutesStr} ${ampm}`;
}

const formateDateToDayText = (isoDate) => {
    const date = new Date(isoDate);
    const today = new Date();

    // Normalize dates to ignore time for comparison
    today.setHours(23, 59, 59, 999);
    date.setHours(23, 59, 59, 999)

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextSeventhDay = new Date(today);
    nextSeventhDay.setDate(today.getDate() + 6);



    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    if (date.getTime() === today.getTime()) {
        return 'Today';
    } else if (date.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    } else if (date.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    } else if (date.getFullYear() === today.getFullYear() && date.getTime() > today.getTime() && date.getTime() <= nextSeventhDay.getTime()) {
        return `${dayOfWeek}`;
    } else if (date.getFullYear() === today.getFullYear()) {
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else {
        return `In ${formattedDate}`;
    }
}



export { stringToLocalTime, YYYYMMDDFormat, getTimeFromSecond, secondsToHHMM, TimeBasedGreeting, convertIsoToAmPm, formateDateToDayText }