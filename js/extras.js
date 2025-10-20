

const CLOSE = `<span class="close" onclick="this.parentElement.style.display='none'">✖</span>`

export function errMessage(element, message) {
    element.style.display = "block";
    element.innerHTML = message + CLOSE;
}

