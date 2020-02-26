/*eslint-disable*/
//Push notifications
const publicVapidKey = '';

const run = async() => {
    await navigator.serviceWorker
      .register(`/scripts/worker.js`, {scope: '/scripts/'})
      .then(waitRegistration);
}

const waitRegistration = (reg) => {
    var serviceWorker;
    if (reg.installing) {
        serviceWorker = reg.installing;
    } else if (reg.waiting) {
        serviceWorker = reg.waiting;
    } else if (reg.active) {
        serviceWorker = reg.active;
    }

    if (serviceWorker) {
        if (serviceWorker.state == "activated") {
            subscribeForPush(reg);
        }
        serviceWorker.addEventListener("statechange", function(e) {
            if (e.target.state == "activated") {
                subscribeForPush(reg);
            }
        });
    }
}

if ('serviceWorker' in navigator) {
    run().catch(error => console.error(error));
}

const subscribeForPush = async (reg) => {
    await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    })
    .then((sub) => {
        fetch('/subscribe', {
            method: 'POST',
            body: JSON.stringify(sub),
            headers: {
                'content-type': 'application/json'
            }
        });
    });
}

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * Removes a query string parameter from the url.
 * @param {string} url The current URL
 * @param {string} parameter The query string parameter to be removed
 * @returns {string} Updated URL 
 */
const removeURLParameter = (url, parameter) => {
    const urlparts = url.split('?'); 
      
    if (urlparts.length >= 2) {
        const prefix = `${encodeURIComponent(parameter)}=`;
        const pars = urlparts[1].split(/[&;]/gu);

        for (let index = pars.length; index > 0;) {
            index -= 1;
            if (pars[index].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(index, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? `?${pars.join('&')}` : "");
    }

    return url;
}

/**
 * Adds or modifies a query string parameter in the url.
 * @param {string} uri The current URL
 * @param {string} key Query string parameter to be updated
 * @param {string} value The value to set for the parameter
 * @returns {string} Updated URL 
 */
const updateQueryStringParameter = (uri, key, value) => {
    const re = new RegExp(`([?&])${key}=.*?(&|#|$)`, "iu");

    if (uri.match(re)) {
        return uri.replace(re, `$1${key}=${value}$2`);
    }
    let hash = '',
    prefix = uri;

    if(uri.indexOf('#') !== -1){
        hash = uri.replace(/.*#/u, '#');
        prefix = uri.replace(/#.*/u, '');
    }
    const separator = prefix.indexOf('?') == -1 ? "?" : "&";  

    return `${prefix}${separator}${key}=${value}${hash}`;
}

/**
 * Event fired when filter control in store listing is clicked. Adds or removes values from query string parameters and reloads page.
 * @param {object} sender Filter control which was clicked
 * @param {string} url The current URL
 * @returns {void}
 */
const filterChanged = (sender, url) => {
    if(sender.checked) {
        url = updateQueryStringParameter(url, sender.id, 1);
    }
    else {
        url = removeURLParameter(url, sender.id);
    }
    window.location.href = url;
}