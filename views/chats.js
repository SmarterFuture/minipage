import { SUPPORT_MAIL } from "../backend/consts";
import { head } from "./const";



export function chatsPage() {
  return `
<!DOCTYPE html>
<html lang="en">
${head("Messages")}
<body>

<div class="info banner">
    💬 If something doesn’t seem to work or you just feel ignored, send me a mail at 
    <a href="mailto:${SUPPORT_MAIL}">${SUPPORT_MAIL}</a> — I am happy to help!
</div>

<div class="container fullheight" style="height: calc(100vh - 8rem)">
    <h2>Messages</h2>
    <div id="messages" class="messages">Loading messages...</div>

    <form id="messageForm" class="message-form">
        <div class="input-row">
            <button type="button" id="attachBtn" title="Attach file">✚</button>
            <textarea id="text" placeholder="Type your message..." required></textarea>
            <button type="submit" id="sendBtn" title="Send message">➜</button>
        </div>
        <input type="file" id="file" accept="application/pdf,image/*" hidden>
        <div id="attachedFile" class="attached-file"></div>
    </form>
</div>

<script src="/static/chats_page.js"></script>
</body>
</html>`;
}
