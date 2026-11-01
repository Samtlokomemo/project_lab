import { Route } from '@/data/routes';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export interface InteractiveMapProps {
  routes: Route[];
  selectedRouteId: string;
  onSelectBus?: (code: string) => void;
  onSelectRoute?: (routeId: string) => void;
}

export function InteractiveMap({
  routes,
  selectedRouteId,
  onSelectBus,
  onSelectRoute,
}: InteractiveMapProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const selectedRoute =
    routes.find((r) => r.id === selectedRouteId) || routes[0];

  // Leaflet com OpenStreetMap 100% público oficial + filtro CSS Dark Mode instantâneo e infalível
  const mapHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>UNIMOBI Map</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #0B0F19; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    
    /* Filtro CSS Dark Mode sobre o OpenStreetMap oficial (não requer API key nem WebGL) */
    .leaflet-tile-pane {
      filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(120%);
    }

    /* Estilo dos Marcadores de Parada */
    .stop-marker {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2.5px solid #FFFFFF;
      box-shadow: 0 2px 6px rgba(0,0,0,0.6);
      cursor: pointer;
    }

    /* Estilo dos Marcadores de Ônibus ao Vivo */
    .bus-marker {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 800;
      color: #0B0F19;
      box-shadow: 0 4px 12px rgba(0,0,0,0.7);
      border: 2px solid #FFFFFF;
      white-space: nowrap;
      cursor: pointer;
    }

    /* Popups Dark Mode */
    .leaflet-popup-content-wrapper {
      background: #131A29 !important;
      color: #F8FAFC !important;
      border-radius: 12px !important;
      border: 1px solid rgba(255,255,255,0.15) !important;
      box-shadow: 0 8px 20px rgba(0,0,0,0.6) !important;
    }
    .leaflet-popup-tip {
      background: #131A29 !important;
    }
    .leaflet-control-zoom {
      border: none !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
    }
    .leaflet-control-zoom a {
      background: #131A29 !important;
      color: #F8FAFC !important;
      border: 1px solid rgba(255,255,255,0.12) !important;
    }
    .leaflet-control-zoom a:hover {
      background: #1E293B !important;
      color: #22C55E !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const routesData = ${JSON.stringify(routes)};
    let activeRouteId = "${selectedRouteId}";

    // Inicializa o mapa centrado em Maceió / AL
    const map = L.map('map', {
      center: [-9.56, -35.73],
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });

    // Camada oficial OpenStreetMap (sempre online, sem token)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    const polylineLayers = {};

    function renderMapElements() {
      routesData.forEach(route => {
        const isSelected = route.id === activeRouteId;
        // Leaflet usa [latitude, longitude]
        const latLngs = route.stops.map(s => [s.coords[1], s.coords[0]]);

        // Traçado das linhas
        const polyline = L.polyline(latLngs, {
          color: route.color,
          weight: isSelected ? 6 : 3.5,
          opacity: isSelected ? 1 : 0.45,
          dashArray: isSelected ? null : '6, 6'
        }).addTo(map);

        polyline.on('click', () => {
          window.parent.postMessage({ type: 'SELECT_ROUTE', routeId: route.id }, '*');
        });

        polylineLayers[route.id] = polyline;

        // Marcadores das paradas
        route.stops.forEach(stop => {
          const icon = L.divIcon({
            className: 'custom-stop',
            html: '<div class="stop-marker" style="background-color: ' + route.color + ';"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          L.marker([stop.coords[1], stop.coords[0]], { icon })
            .addTo(map)
            .bindPopup(
              '<strong style="font-size:13px;">' + stop.name + '</strong><br>' +
              '<span style="color:#94A3B8; font-size:11px;">' + stop.city + ' • ' + route.name + '</span>'
            );
        });

        // Marcador de ônibus ao vivo
        if (route.activeBus) {
          const bus = route.activeBus;
          const busIcon = L.divIcon({
            className: 'custom-bus',
            html: '<div class="bus-marker" style="background-color: ' + route.color + ';">🚌 ' + bus.id + '</div>',
            iconSize: [85, 26],
            iconAnchor: [42, 13]
          });

          const marker = L.marker([bus.coords[1], bus.coords[0]], { icon: busIcon })
            .addTo(map)
            .bindPopup(
              '<strong style="font-size:13px;">Ônibus ' + bus.id + '</strong><br>' +
              '<span style="color:#38BDF8; font-size:11px;">' + route.name + '</span><br>' +
              '<span style="color:#F8FAFC; font-size:11px; margin-top:4px; display:inline-block;">Parada: ' + bus.stopName + '</span><br>' +
              '<span style="color:#22C55E; font-size:11px; font-weight:700;">Lotação: ' + bus.crowdLevel + '%</span>'
            );

          marker.on('click', () => {
            window.parent.postMessage({ type: 'SELECT_BUS', routeId: route.id, busId: bus.id }, '*');
          });
        }
      });

      fitToActiveRoute();
    }

    function fitToActiveRoute() {
      const active = routesData.find(r => r.id === activeRouteId);
      if (active && active.stops.length > 0) {
        const bounds = L.latLngBounds(active.stops.map(s => [s.coords[1], s.coords[0]]));
        map.fitBounds(bounds, {
          paddingTopLeft: [60, 90],
          paddingBottomRight: [60, 230],
          animate: true
        });
      }
    }

    renderMapElements();

    // Listener para troca de rota vinda do app pai
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CHANGE_ROUTE') {
        activeRouteId = event.data.routeId;
        Object.keys(polylineLayers).forEach(id => {
          const isSelected = id === activeRouteId;
          polylineLayers[id].setStyle({
            weight: isSelected ? 6 : 3.5,
            opacity: isSelected ? 1 : 0.45,
            dashArray: isSelected ? null : '6, 6'
          });
        });
        fitToActiveRoute();
      }
    });
  </script>
</body>
</html>
  `;

  // Comunicação Web: PostMessage para atualizar rota no mapa sem reload
  useEffect(() => {
    if (Platform.OS === 'web' && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'CHANGE_ROUTE', routeId: selectedRouteId },
        '*'
      );
    }
  }, [selectedRouteId]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleMessage = (event: MessageEvent) => {
        if (!event.data) return;
        if (event.data.type === 'SELECT_ROUTE') {
          onSelectRoute?.(event.data.routeId);
        } else if (event.data.type === 'SELECT_BUS') {
          onSelectRoute?.(event.data.routeId);
          onSelectBus?.(event.data.busId);
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [onSelectRoute, onSelectBus]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          ref={iframeRef}
          srcDoc={mapHtml}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
          title="Mapa de Mobilidade Universitária"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.nativeFallback}>
        <Ionicons name="map" size={48} color="#22C55E" />
        <Text style={styles.fallbackTitle}>Mapa UNIMOBI</Text>
        <Text style={styles.fallbackSub}>Linha em foco: {selectedRoute.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0B0F19',
  },
  nativeFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  fallbackTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  fallbackSub: {
    color: '#94A3B8',
    fontSize: 13,
  },
});
