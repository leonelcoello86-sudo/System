import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import TelemetryPanel from './TelemetryPanel.jsx';

const defaultCenter = [11.40769, -69.67822];

function MapView() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const mapCenter = useMemo(() => {
    if (assets.length > 0) {
      const first = assets.find((asset) => asset.latitude !== undefined && asset.longitude !== undefined);
      if (first) return [first.latitude, first.longitude];
    }
    return defaultCenter;
  }, [assets]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2.2fr_0.8fr] xl:grid-cols-[2.6fr_0.6fr]">
        <section className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-0 shadow-glass backdrop-blur-xl">
          <div className="h-[520px] overflow-hidden rounded-[30px] bg-[#0b1921]/70 shadow-[inset_0_0_40px_rgba(0,242,255,0.08)]">
            <MapContainer center={mapCenter} zoom={12} scrollWheelZoom className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {assets.map((asset) => {
                if (asset.latitude === undefined || asset.longitude === undefined) return null;
                return (
                  <CircleMarker
                    key={asset._id}
                    center={[asset.latitude, asset.longitude]}
                    radius={10}
                    pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 0.8 }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>{asset.name}</strong>
                        <div>Tipo: {asset.type}</div>
                        <div>Estado: {asset.status}</div>
                        {asset.type === 'UAV' && <div>Batería: {asset.battery ?? 'N/A'}%</div>}
                        {asset.type === 'Vehículo' && <div>Combustible: {asset.fuel ?? 'N/A'}%</div>}
                        {asset.type === 'Personal' && <div>Efectivos: {asset.personnel ?? 'N/A'}</div>}
                      </div>
                    </Popup>
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                      {asset.name}
                    </Tooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </section>

        <TelemetryPanel assets={assets} loading={loading} error={error} />
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
