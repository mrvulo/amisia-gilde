document.addEventListener("DOMContentLoaded", () => {
    loadComments();
});

function addRaidLog() {
    const logList = document.getElementById("raid-log");
    const timestamp = new Date().toLocaleTimeString();
    const newEntry = document.createElement("li");
    newEntry.textContent = `[${timestamp}] Neues Raid-Ereignis`;
    logList.appendChild(newEntry);
}

function addComment() {
    const commentInput = document.getElementById("comment-input");
    const commentList = document.getElementById("comment-list");

    if (commentInput.value.trim() === "") return;

    const newComment = document.createElement("li");
    newComment.textContent = commentInput.value;
    commentList.appendChild(newComment);

    saveComment(commentInput.value);
    commentInput.value = "";
}

function saveComment(comment) {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));
}

function loadComments() {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    const commentList = document.getElementById("comment-list");

    comments.forEach(comment => {
        const newComment = document.createElement("li");
        newComment.textContent = comment;
        commentList.appendChild(newComment);
    });
}
