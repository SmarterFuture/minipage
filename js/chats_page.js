
const LOAD_MORE = `<button class="more-btn" onclick="loadMore()">Load more messages</button>`;
const PAGE_SIZE = 50;
let cur_page = 0;

async function loadMore() {
    cur_page++
    await loadMessages(cur_page)
}

async function loadMessages(offset = 0) {
    const messagesDiv = document.getElementById('messages');

    messagesDiv.firstElementChild?.remove();
    const previous = !offset ? "" : messagesDiv.innerHTML;

    messagesDiv.textContent = 'Loading messages...';
    try {
        const res = await fetch('/get-messages', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ start: PAGE_SIZE * offset, end: PAGE_SIZE * (offset + 1) })
        });
        const data = await res.json();

        if (data.err) throw new Error(data.err);
        
        const msgs = data.msgs || [];

        if (!msgs.length && offset === 0) {
            messagesDiv.textContent = 'No messages yet.';
            return;
        } 

        const messages = msgs.reverse().map(m => `
<div class="${m.who === "you" ? "m-you" : "m-admin"} m-all">
    <div class="message">
        <div class="text">${escapeHTML(m.text || '')}</div>
        ${displayAtt(m.attachment)}
    </div>
    <div class="meta">${m.who} • ${new Date(m.created).toLocaleString()}</div>
</div>`)
            .join('');
            
        messagesDiv.innerHTML = LOAD_MORE + messages + previous;
        
        if (offset === 0) {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    } catch (err) {
        console.error(err);
        messagesDiv.textContent = 'Error loading messages.';
    }
}

function displayAtt(att) {
    if (!att || !att.length) return '';
    
    return att.map(file =>
        `<div class="attachment"><a href="${file.path}" target="_blank">${escapeHTML(file.filename)}</a></div>`)
        .join("");
}

document.getElementById('messageForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = document.getElementById('text').value.trim();
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    if (!text && !file) {
        alert('Please write a message or attach a file.');
        return;
    }

    const formData = new FormData();
    formData.append('text', text || "Attachment");
    if (file) {
        if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) {
            alert('Only images or PDFs are allowed.');
            return;
        }
        formData.append('file', file);
    }

    try {
        const res = await fetch('/post-message', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.err);

        document.getElementById('text').value = '';
        document.getElementById('file').value = '';
        document.getElementById('attachedFile').textContent = '';
        loadMessages();
    } catch (err) {
        console.error(err);
        alert('You are not logged in. Try logining in.');
    }
});

document.getElementById('attachBtn').addEventListener('click', () => {
    document.getElementById('file').click();
});

document.getElementById('file').addEventListener('change', () => {
    const file = document.getElementById('file').files[0];
    const fileLabel = document.getElementById('attachedFile');

    if (file) {
        if (!(file.type.startsWith('image/') || file.type === 'application/pdf')) {
            alert('Only images or PDFs are allowed.');
            document.getElementById('file').value = '';
            fileLabel.textContent = '';
            return;
        }
        fileLabel.textContent = `Attached: ${file.name}`;
    } else {
        fileLabel.textContent = '';
    }
});

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, s => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[s]));
}

loadMessages();

