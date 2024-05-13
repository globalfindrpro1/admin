export const objectLength = (myObj) => {
    if(myObj == false) {
        return 0;
    }

    if(typeof myObj == 'object' && myObj != null) {
        return Object.keys(myObj).length;
    }
}

export const getKeyInObject = (obj, key) => {
    if (key in obj) {
        return obj[key];
    } else {
        return '';
    }
}
