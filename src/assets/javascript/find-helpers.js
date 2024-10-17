const getUserProfileImagePath = (last_name) => {
    // Check if the user or user's last_name exists
    const firstLetter = last_name?.charAt(0)?.toUpperCase();

    if (firstLetter) {
        try {
            // Dynamically require the image based on the first letter
            return require(`../images/profile-tamp/${firstLetter}.png`);
        } catch (error) {
            // If the specific image doesn't exist, fallback to the common image
            return require('../images/profile-tamp/common.png');
        }
    } else {
        // If user or last_name is not defined, or the first letter could not be determined
        return require('../images/profile-tamp/common.png');
    }
}

const findAgeFromDate = (birthDateIso) => {
    const birthDate = new Date(birthDateIso);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}


export { getUserProfileImagePath, findAgeFromDate }