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

export const doSignOut = (includeDeviceId) => {
   
    // Clear Cookie
    if (includeDeviceId) {
        Cookies.remove('DVC_ID');
    }
    Cookies.remove('ACC_ID');
    Cookies.remove('AUTH');
    Cookies.remove('_acc_tkn');
    Cookies.remove('_rfs_tkn');

    // Clear IndexedDB
    deleteIndexedDB('initial_storage')

}