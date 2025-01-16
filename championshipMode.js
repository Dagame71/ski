// championshipMode.js

/**
 * Championship Mode for Ski Track Simulator
 */

// Global Variables for Championship Mode
let players = []; // Array to hold player names and scores
let currentManche = 1; // Current manche (1, 2, or 3)
let currentPlayerIndex = 0; // Index of the current player
let championshipTrack = null; // Track used for the current manche
let championshipResults = []; // Stores times and scores for each player

// Initialize Championship Mode
function initializeChampionshipMode() {
    players = [];
    currentManche = 1;
    currentPlayerIndex = 0;
    championshipTrack = null;
    championshipResults = players.map(player => ({ name: player, totalScore: 0 }));
    promptForPlayerNames();
}

// Prompt the user to enter player names
function promptForPlayerNames() {
    const playerCount = prompt("Enter the number of players (minimum 2):");
    if (!playerCount || isNaN(playerCount) || playerCount < 2) {
        alert("You need at least 2 players to start the championship.");
        return;
    }

    for (let i = 0; i < playerCount; i++) {
        const playerName = prompt(`Enter the name of player ${i + 1}:`);
        if (playerName) {
            players.push({ name: playerName, totalScore: 0 });
        } else {
            alert("Player name cannot be empty.");
            i--;
        }
    }

    startManche();
}

// Start a Manche
function startManche() {
    alert(`Starting Manche ${currentManche}. All players will compete on the same track.`);
    
    // Genera la pista per la manche
    championshipTrack = {
        gates: generateGates(),
        trees: [] // Aggiungi alberi solo se necessario
    };

    // Disegna la pista sul canvas
    resetTrack(championshipTrack);

    // Inizia il turno del primo giocatore
    currentPlayerIndex = 0;
    startPlayerTurn();
}
function resetTrack(track) {
    drawing = false;
    points = [];
    intersectedGates.clear();
    trees = track.trees || []; // Gestisce gli alberi se presenti
    finalTimeOutput.textContent = "⏰1'00\"000'''";
    statusOutput.textContent = '';
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (track && track.gates) {
        gates = track.gates;
    } else {
        gates = generateGates(); // Fallback se la pista non è valida
    }

    drawTrack(track);
}
// Start the current player's turn
function startPlayerTurn() {
    const player = players[currentPlayerIndex];
    alert(`${player.name}, it's your turn! You have 3 attempts on this track.`);

    let playerTimes = [];

    for (let attempt = 1; attempt <= 3; attempt++) {
        alert(`Attempt ${attempt} for ${player.name}.`);

        // Reset the track and let the player make their run
        resetTrack(championshipTrack);

        // Simula il gameplay o attiva la funzione reale
        const runTime = simulateRun(); // Deve richiamare le funzionalità esistenti

        if (runTime) {
            playerTimes.push(runTime);
        } else {
            alert("Run incomplete. Moving to the next attempt.");
        }
    }

    const bestTime = Math.min(...playerTimes);
    alert(`${player.name}'s best time: ${formatTime(bestTime)}`);

    championshipResults.push({ name: player.name, time: bestTime });

    currentPlayerIndex++;

    if (currentPlayerIndex < players.length) {
        startPlayerTurn();
    } else {
        endManche();
    }
}


// End the current manche
function endManche() {
    alert(`Manche ${currentManche} complete! Calculating results...`);

    // Sort results and assign points
    const sortedResults = [...championshipResults].sort((a, b) => a.time - b.time);
    sortedResults.forEach((result, index) => {
        const points = [9, 6, 4, 2, 1][index] || 0; // Points for Top 5
        const player = players.find(p => p.name === result.name);
        if (player) {
            player.totalScore += points;
        }
    });

    // Show the leaderboard for the manche
    showLeaderboard(sortedResults);

    // Proceed to the next manche or end the championship
    if (currentManche < 3) {
        currentManche++;
        startManche();
    } else {
        endChampionship();
    }
}

// Show the leaderboard for the manche
function showLeaderboard(results) {
    let leaderboardText = `Top 5 for Manche ${currentManche}:\n`;
    results.slice(0, 5).forEach((result, index) => {
        leaderboardText += `${index + 1}. ${result.name} - ${formatTime(result.time)}\n`;
    });

    leaderboardText += "\nOverall Points:\n";
    players.forEach(player => {
        leaderboardText += `${player.name}: ${player.totalScore} points\n`;
    });

    alert(leaderboardText);
}

// End the championship
function endChampionship() {
    alert("Championship complete! Calculating final results...");

    // Sort players by total score
    const finalResults = [...players].sort((a, b) => b.totalScore - a.totalScore);

    let finalLeaderboard = "Final Championship Results:\n";
    finalResults.forEach((player, index) => {
        finalLeaderboard += `${index + 1}. ${player.name} - ${player.totalScore} points\n`;
    });

    alert(finalLeaderboard);
}

// Utility function to simulate a run (placeholder for actual gameplay logic)
function simulateRun() {
    // Simulate gameplay; in the actual implementation, this would involve player interaction
    const randomTime = Math.random() * 30 + 60; // Random time between 60 and 90 seconds
    return randomTime;
}

// Attach Championship Mode to the game
const championshipButton = document.getElementById("championshipButton");
championshipButton.addEventListener("click", initializeChampionshipMode);
