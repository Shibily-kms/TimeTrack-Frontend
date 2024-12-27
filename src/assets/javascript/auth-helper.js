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
        secure: false, // Set to `true` in production (for HTTPS)
        // domain: '.domain.com', // Allows cookie sharing across subdomains
        sameSite: 'lax', // Helps prevent CSRF attacks , use 'strict' on host,
        path: '/',
        expires: 40
    });

    Cookies.remove('_acc_tkn');
    Cookies.remove('_rfs_tkn');

    // Clear IndexedDB
    deleteIndexedDB('initial_storage')

}