import { isMobile, isDesktop, isTablet, osName, osVersion, mobileVendor, mobileModel } from 'react-device-detect';
import Bowser from 'bowser';
import axios from 'axios';

export const deviceIdBuilder = () => {
    const sting_length = 32;
    const numbers = '123456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    let randomString = '';
    for (let i = 0; i < sting_length; i++) {
        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
    return randomString
}

export const getDeviceAndBrowserInfo = async () => {
    try {
        // Get IP Address
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ip = ipResponse.data.ip;

        // Get Browser Info
        const browser = Bowser.getParser(window.navigator.userAgent);
        const browserName = browser.getBrowserName();
        const browserVersion = browser.getBrowserVersion();

        // Collect all details
        const details = {
            os: {
                name: osName,
                version: osVersion
            },
            browser: {
                name: browserName,
                version: browserVersion
            },
            device: {
                vendor: mobileVendor === 'none' ? null : mobileVendor,
                model: mobileModel === 'none' ? null : mobileModel
            },
            device_type: isMobile ? 'Mobile' : isTablet ? 'Tablet' : isDesktop ? 'Desktop' : null,
            ip,
        };

        return details;

    } catch (error) {
        return null;
    }
};



