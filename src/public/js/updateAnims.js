document.getElementById('info_window').style = 'transition-delay: 0.1s; transform: translate(-50%, 0%); opacity: 1; display: inline-block';
document.getElementById('id_window').style = 'transition-delay: 0.1s; transform: translate(-50%, 0%); opacity: 0; display: none';
document.getElementById('address_window').style = 'transition-delay: 0.1s; transform: translate(-50%, 0%); opacity: 0;display: none'
document.getElementById('left_nav').style = 'left: 25%; top:50%; transform: translate(-50%,-50%)'
document.getElementById('right_nav').style = 'left: 75%; top:50%; transform: translate(-50%,-50%)'

const windowList = ['info_window', 'id_window', 'address_window'];
const MAX_WINDOW = 2;
let currentWindow = 0;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

window.switchWindowLeft = async () => {
    if (currentWindow > 0) {
        document.getElementById(windowList[currentWindow - 1]).style = 'transition-delay: 0.1s; transform: translate(-60%, 0%); opacity: 0; display: inline-block';
        document.getElementById(windowList[currentWindow]).style = 'transform: translate(-40%, 0%); opacity: 0';
        await sleep(200);
        document.getElementById(windowList[currentWindow]).style = 'display: none';
        document.getElementById(windowList[currentWindow - 1]).style = 'transition-delay: 0.1s; transform: translate(-50%, 0%); opacity: 1; display: inline-block';
        currentWindow = currentWindow - 1;
    }
}


window.switchWindowRight = async () => {
    if (currentWindow < MAX_WINDOW) {
        document.getElementById(windowList[currentWindow + 1]).style = 'transition-delay: 0.1s; transform: translate(-40%, 0%); opacity: 0; display: inline-block';
        document.getElementById(windowList[currentWindow]).style = 'transform: translate(-60%, 0%); opacity: 0';
        await sleep(200);
        document.getElementById(windowList[currentWindow]).style = 'display: none';
        document.getElementById(windowList[currentWindow + 1]).style = 'transition-delay: 0.1s; transform: translate(-50%, 0%); opacity: 1; display: inline-block';
        currentWindow = currentWindow + 1;
    }
    console.log(windowList[currentWindow])
}
