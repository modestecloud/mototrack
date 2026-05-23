// Initialiser la carte
const map = L.map('map').setView([7.3267, 13.5840], 13);

// Ajouter les tuiles OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Icône moto personnalisée
const motoIcon = L.divIcon({
  html: '🏍️',
  iconSize: [30, 30],
  className: 'moto-icon'
});

// Créer le marqueur
let marker = L.marker([7.3267, 13.5840], { icon: motoIcon })
  .addTo(map)
  .bindPopup('<b>Ma Moto</b><br>Position actuelle')
  .openPopup();

// Ligne du trajet
let pointsTrajet = [];
let ligneTrajet = L.polyline([], {
  color: '#ff6b00',
  weight: 4,
  opacity: 0.8
}).addTo(map);

// Fonction qui met à jour la position
function mettreAJourPosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const vitesse = position.coords.speed;

  // Déplacer le marqueur
  marker.setLatLng([lat, lng]);
  map.setView([lat, lng], 15);

  // Ajouter le point au trajet
  pointsTrajet.push([lat, lng]);
  ligneTrajet.setLatLngs(pointsTrajet);

  // Afficher les infos
  document.getElementById('lat').textContent = lat.toFixed(5);
  document.getElementById('lng').textContent = lng.toFixed(5);

  // Afficher la vitesse
  if (vitesse !== null) {
    const kmh = Math.round(vitesse * 3.6);
    document.getElementById('speed').textContent = kmh + ' km/h';
    document.getElementById('statut').textContent = kmh > 2 ? 'En mouvement' : 'Arrêté';
  }

  // Sauvegarder dans localStorage
  const heure = new Date().toLocaleTimeString('fr-FR');
  const historique = JSON.parse(localStorage.getItem('trajet') || '[]');
  historique.push({ lat, lng, heure });
  localStorage.setItem('trajet', JSON.stringify(historique));
  // Système d'alertes
  const heureMaintenant = new Date().toLocaleTimeString('fr-FR');
  const listealertes = document.getElementById('liste-alertes');

  if (vitesse !== null) {
    const kmh = Math.round(vitesse * 3.6);
    if (kmh > 100) {
      listeAlertes.innerHTML += `<div class="alerte alerte-danger">🚨 ${heureMaintenant} — Vitesse excessive : ${kmh} km/h !</div>`;
    } else if (kmh > 2) {
      listeAlertes.innerHTML += `<div class="alerte alerte-warn">⚠️ ${heureMaintenant} — Moto en mouvement : ${kmh} km/h</div>`;
    }
  }
}

// Fonction en cas d'erreur
function erreurPosition(erreur) {
  console.log('Erreur GPS : ' + erreur.message);
}

// Démarrer la localisation en temps réel
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    mettreAJourPosition,
    erreurPosition,
    { enableHighAccuracy: true }
  );
} else {
  alert('La géolocalisation nest pas supportée sur cet appareil.');
}