import Cookies from 'js-cookie';

function deleteIndexedDB(databaseName) {
    const deleteRequest = indexedDB.deleteDatabase(databaseName);

    deleteRequest.onsuccess = function () {
        console.log(`${databaseName} has been deleted.`);
    };

    deleteRequest.onerror = function (event) {
        console.log('Error deleting database:', event.target.errorCode);
    };

    deleteRequest.onblocked = function () {
        console.log('Delete request is blocked. Close other connections.');
    };
}

export const doSignOut = () => {

    Cookies.set('logged_in', 'no', {
        secure: true, // Set to `true` in production (for HTTPS)
        domain: '.alliancewatersolutions.com', // Allows cookie sharing across subdomains
        sameSite: 'None', // Helps prevent CSRF attacks , use 'strict' on host,
        path: '/',
        expires: new Date(new Date().setMonth(new Date().getMonth() + 6))
    });

    Cookies.remove('_acc_tkn');
    Cookies.remove('_rfs_tkn');

    // Clear IndexedDB
    deleteIndexedDB('initial_storage')

}