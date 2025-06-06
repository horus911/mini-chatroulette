// Configuration
const config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
    ]
};

// Éléments DOM
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const statusEl = document.getElementById('status');
const peerIdEl = document.getElementById('peer-id');
const peerIdContainer = document.getElementById('peer-id-container');

// Variables globales
let peer;
let localStream;
let currentCall;

// Démarrer l'application
startBtn.addEventListener('click', init);

// Trouver un nouvel utilisateur
nextBtn.addEventListener('click', () => {
    if (currentCall) {
        currentCall.close();
    }
    findRandomPeer();
});

async function init() {
    startBtn.disabled = true;
    statusEl.textContent = "Obtention de votre flux média...";
    
    try {
        // Obtenir le flux caméra/microphone
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        
        // Initialiser PeerJS
        peer = new Peer({
            config,
            debug: 3
        });
        
        peer.on('open', (id) => {
            statusEl.textContent = "Connecté, recherche d'un partenaire...";
            peerIdEl.textContent = id;
            peerIdContainer.style.display = 'block';
            findRandomPeer();
        });
        
        peer.on('call', (call) => {
            // Répondre à l'appel avec notre stream
            call.answer(localStream);
            setupCall(call);
        });
        
        peer.on('error', (err) => {
            console.error(err);
            statusEl.textContent = "Erreur: " + err.message;
        });
        
        peer.on('disconnected', () => {
            statusEl.textContent = "Déconnecté. Reconnexion...";
            peer.reconnect();
        });
        
    } catch (err) {
        console.error("Erreur:", err);
        statusEl.textContent = "Erreur: " + err.message;
        startBtn.disabled = false;
    }
}

function findRandomPeer() {
    statusEl.textContent = "Recherche d'un partenaire aléatoire...";
    nextBtn.disabled = true;
    
    // Dans une vraie app, vous auriez besoin d'un serveur pour trouver des pairs disponibles
    // Ceci est une simulation qui attend qu'un autre utilisateur se connecte
    
    // Pour un vrai système, vous pourriez utiliser un serveur simple comme:
    // - Un serverless function Netlify
    // - Un tableau partagé via un service comme PeerJS Server
    // Mais pour cette démo, nous allons juste attendre une connexion entrante
}

function setupCall(call) {
    currentCall = call;
    statusEl.textContent = "Appel en cours...";
    nextBtn.disabled = false;
    
    call.on('stream', (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
        statusEl.textContent = "Connecté!";
    });
    
    call.on('close', () => {
        remoteVideo.srcObject = null;
        statusEl.textContent = "Appel terminé. Cliquez pour trouver quelqu'un d'autre.";
    });
    
    call.on('error', (err) => {
        console.error(err);
        statusEl.textContent = "Erreur d'appel: " + err.message;
    });
}