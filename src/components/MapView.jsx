import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import TelemetryPanel from './TelemetryPanel.jsx';

const defaultCenter = [11.40769, -69.67822];

function MapView() {
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const PAGE_SIZE = 3;

  const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

  const fetchAssets = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/assets`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Error obteniendo activos');
      }
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    // reset page when assets update to avoid out-of-range pages
    setPage(0);
  }, [assets]);

  const mapCenter = useMemo(() => {
    if (assets.length > 0) {
      const first = assets.find((asset) => asset.latitude !== undefined && asset.longitude !== undefined);
      if (first) return [first.latitude, first.longitude];
    }
    return defaultCenter;
  }, [assets]);

  const markerIcons = {
    soldado: divIcon({
      html: '<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#0f172a;color:#22d3ee;border:2px solid #22d3ee;font-size:18px;">👤</div>',
      className: 'custom-marker-icon',
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    }),
    vehiculo: divIcon({
      html: '<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#0f172a;border:2px solid #f8b400;"><svg viewBox="0 0 64 64" width="22" height="22" fill="#f8b400" xmlns="http://www.w3.org/2000/svg"><path d="M6 38h52v8H6z"/><path d="M14 30h36l8 8H6l8-8z"/><path d="M22 30v-8h18l8 8H22z"/><path d="M46 14h-4l-4 8h-8l-4 6h-4v6h24v-14z"/><circle cx="18" cy="50" r="5"/><circle cx="46" cy="50" r="5"/></svg></div>',
      className: 'custom-marker-icon',
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    }),
    dron: divIcon({
      html: '<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#0f172a;color:#ef4444;border:2px solid #ef4444;font-size:18px;">🛩️</div>',
      className: 'custom-marker-icon',
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    })
  };

  function MapAutoResize({ trigger }) {
    // child component for MapContainer to access the map instance and force resize
    // when the assets list changes so the map redraws to the container size.
    const map = useMap();
    useEffect(() => {
      // allow layout to settle
      setTimeout(() => map.invalidateSize(), 120);
    }, [trigger]);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 items-start lg:grid-cols-[2.2fr_0.8fr] xl:grid-cols-[2.6fr_0.6fr]">
        <section className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-0 shadow-glass backdrop-blur-xl">
            <div className="h-[640px] overflow-hidden rounded-[30px] bg-[#0b1921]/70 shadow-[inset_0_0_40px_rgba(0,242,255,0.08)]">
            <MapContainer center={mapCenter} zoom={12} scrollWheelZoom className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapAutoResize trigger={assets.length} />
              {assets.map((asset) => {
                if (asset.latitude === undefined || asset.longitude === undefined) return null;
                const markerIcon = markerIcons[asset.icon] || markerIcons.soldado;
                return (
                  <Marker
                    key={asset._id}
                    position={[asset.latitude, asset.longitude]}
                    icon={markerIcon}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>{asset.name}</strong>
                        <div>Tipo: {asset.type}</div>
                        <div>Icono: {asset.icon}</div>
                        <div>Estado: {asset.status}</div>
                        {asset.type === 'UAV' && <div>Batería: {asset.battery ?? 'N/A'}%</div>}
                        {asset.type === 'Vehículo' && <div>Combustible: {asset.fuel ?? 'N/A'}%</div>}
                        {asset.type === 'Personal' && <div>Efectivos: {asset.personnel ?? 'N/A'}</div>}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </section>

        <div className="max-h-[640px] overflow-y-auto">
          <TelemetryPanel
            assets={assets.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)}
            loading={loading}
            error={error}
            onNext={() => setPage((p) => p + 1)}
            onPrev={() => setPage((p) => p - 1)}
            currentPage={page}
            totalPages={Math.max(1, Math.ceil(assets.length / PAGE_SIZE))}
          />
        </div>
      </div>
      <section className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-6 shadow-glass backdrop-blur-xl">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Panel de Misión</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Resumen táctico</h3>
            </div>
            <span className="rounded-3xl bg-[#09191f]/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200">Activo</span>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            El módulo Mapa integra telemetría de activos en tiempo real y muestra las unidades cargadas desde la gestión de contenido. Actualiza los activos para ver cambios sin recargar la aplicación.
          </p>
        </div>
      </section>
    </div>
  );
}

export default MapView;
