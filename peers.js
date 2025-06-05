// Stockage en mémoire avec info pays
const activePeers = new Map(); // Maintenant une Map pour stocker plus d'infos

exports.handler = async (event, context) => {
    const { httpMethod, queryStringParameters } = event;
    const { action, peerId, country } = queryStringParameters || {};

    // Seulement GET autorisé
    if (httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        switch (action) {
            case 'register':
                if (!peerId || !country) {
                    return { 
                        statusCode: 400, 
                        body: JSON.stringify({ error: 'peerId and country are required' }) 
                    };
                }
                activePeers.set(peerId, { country, timestamp: Date.now() });
                return {
                    statusCode: 200,
                    body: JSON.stringify({ 
                        success: true,
                        count: activePeers.size 
                    })
                };

            case 'unregister':
                if (!peerId) {
                    return { statusCode: 400, body: 'peerId required' };
                }
                activePeers.delete(peerId);
                return { 
                    statusCode: 200, 
                    body: JSON.stringify({ success: true }) 
                };

            case 'find':
                if (!peerId) {
                    return { statusCode: 400, body: 'peerId required' };
                }

                // Filtrage par pays si spécifié
                const peersArray = Array.from(activePeers.entries())
                    .filter(([id, data]) => id !== peerId && (!country || data.country === country))
                    .map(([id, data]) => id);

                const randomPeer = peersArray.length > 0 
                    ? peersArray[Math.floor(Math.random() * peersArray.length)]
                    : null;

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        available: randomPeer !== null,
                        peer: randomPeer,
                        count: peersArray.length
                    })
                };

            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ 
                        error: 'Action invalide',
                        validActions: ['register', 'unregister', 'find']
                    })
                };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Erreur serveur', 
                details: error.message 
            })
        };
    }
};