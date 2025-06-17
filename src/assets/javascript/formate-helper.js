export function convertAmount(amount) {
   
    if (!Number(amount) && Number(amount) !== 0) {
        return 'Error'
    }

    if (amount < 1000) {
        return amount?.toLocaleString("en-IN"); // Keep as is
    } else if (amount >= 1000 && amount < 10000) {
        return (amount / 1000).toFixed(2) + "K"; // Convert to Thousand (K)
    } else if (amount >= 10000 && amount < 100000) {
        return (amount / 1000).toFixed(2) + "K"; // Convert to 10K+
    } else if (amount >= 100000 && amount < 10000000) {
        return (amount / 100000).toFixed(2) + "L"; // Convert to Lakhs (L)
    } else {
        return (amount / 10000000).toFixed(2) + "Cr"; // Convert to Crores (Cr)
    }
}