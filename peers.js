 // Ajoutez un cache pour les requêtes
const cachedPeers = {
    data: null,
    lastUpdated: 0,
    ttl: 30000 // 30 secondes
};

exports.handler = async (event) => {
    // Utilisation du cache si disponible
    if (Date.now() - cachedPeers.lastUpdated < cachedPeers.ttl && cachedPeers.data) {
        return cachedPeers.data;
    }

    // ... le reste de votre code existant ...

    // Mise en cache avant retour
    const response = {
        statusCode: 200,
        body: JSON.stringify({ /* vos données */ })
    };
    cachedPeers.data = response;
    cachedPeers.lastUpdated = Date.now();
    
    return response;
};
