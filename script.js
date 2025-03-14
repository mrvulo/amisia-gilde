const API_KEY = "DEIN_API_KEY";  // Hier deinen WarcraftLogs API Key einfügen
const GUILD_NAME = "Amisia";
const SERVER_NAME = "Living Flame";
const REGION = "EU";  

async function fetchLogs() {
    const url = `https://www.warcraftlogs.com:443/v1/reports/guild/${GUILD_NAME}/${SERVER_NAME}/${REGION}?api_key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const logs = await response.json();
        
        if (logs.length === 0) {
            document.getElementById("logs").innerHTML = "<p>Keine Logs gefunden.</p>";
            document.getElementById("dps-rankings").innerHTML = "<p>Keine Daten verfügbar.</p>";
            return;
        }

        let logList = "<ul>";
        logs.slice(0, 5).forEach(log => {
            logList += `<li>
                <a href="https://www.warcraftlogs.com/reports/${log.id}" target="_blank">${log.title} - ${new Date(log.start).toLocaleDateString()}</a>
            </li>`;
        });
        logList += "</ul>";

        document.getElementById("logs").innerHTML = logList;

        // Lade DPS-Daten vom neuesten Log
        fetchDPSRankings(logs[0].id);
        
    } catch (error) {
        console.error("Fehler beim Abrufen der Logs:", error);
        document.getElementById("logs").innerHTML = "<p>Fehler beim Laden der Logs.</p>";
        document.getElementById("dps-rankings").innerHTML = "<p>Fehler beim Laden der DPS-Daten.</p>";
    }
}

async function fetchDPSRankings(reportID) {
    const url = `https://www.warcraftlogs.com:443/v1/report/tables/damage-done/${reportID}?api_key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.entries || data.entries.length === 0) {
            document.getElementById("dps-rankings").innerHTML = "<p>Keine DPS-Daten gefunden.</p>";
            return;
        }

        // Sortiere nach DPS und nehme die Top 5
        const topDPS = data.entries.sort((a, b) => b.total - a.total).slice(0, 5);

        let dpsTable = "<table><tr><th>Platz</th><th>Spieler</th><th>Klasse</th><th>DPS</th></tr>";
        topDPS.forEach((player, index) => {
            dpsTable += `<tr>
                <td>#${index + 1}</td>
                <td>${player.name}</td>
                <td>${player.type}</td>
                <td>${Math.round(player.total / (data.totalTime / 1000))} DPS</td>
            </tr>`;
        });
        dpsTable += "</table>";

        document.getElementById("dps-rankings").innerHTML = dpsTable;

    } catch (error) {
        console.error("Fehler beim Abrufen der DPS-Daten:", error);
        document.getElementById("dps-rankings").innerHTML = "<p>Fehler beim Laden der DPS-Daten.</p>";
    }
}

document.addEventListener("DOMContentLoaded", fetchLogs);
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
