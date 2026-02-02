import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { dataRef } from '../Firebase';
import Advanced from "./Advanced";
export default function Dashboard() {
  const [data, setData] = useState({});
  const [alertLevel, setAlertLevel] = useState("safe"); // safe, warning, critical
  const [connected, setConnected] = useState(true);

  // Simulated data for demo purposes
 // Fetch data from Firebase
  useEffect(() => {
    const latestReading = dataRef.ref('/landslide_data');
    
    latestReading.on('value', (snapshot) => {
      const dbData = snapshot.val();
      console.log("Fetched data from Firebase: ", dbData);
      setData(dbData || {});
      setConnected(true);
    }, (error) => {
      console.error("Error fetching data: ", error);
      setConnected(false);
    });

    // Cleanup listener on unmount
    return () => {
      latestReading.off('value');
    };
  }, []);

  // Analyze for Landslide Risk with two-stage detection
  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    const {
      depthMoisturePercent = 0,
      surfaceMoisturePercent = 0,
      humidity = 0,
      isTilted = false,
      tiltCount = 0,
    } = data;

    let dangerScore = 0;

    if (isTilted) dangerScore += 2;
    if (tiltCount > 5) dangerScore += 1;
    if (surfaceMoisturePercent > 70) dangerScore += 1;
    if (depthMoisturePercent > 60) dangerScore += 1;
    if (humidity > 80) dangerScore += 1;

    // Two-stage detection
    if (dangerScore >= 3) {
      setAlertLevel("critical"); // Stage 2: Critical Alert
    } else if (dangerScore >= 2) {
      setAlertLevel("warning"); // Stage 1: Warning Alert
    } else {
      setAlertLevel("safe");
    }
  }, [data]);

  return (
  <>
      <div className="dashboard-container">
      <div className="dashboard-wrapper">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-top">
            <div className="header-title">
              <svg className={`icon-activity ${connected ? 'connected' : 'disconnected'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <h1>Landslide Monitoring System</h1>
            </div>
            <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
              <div className="status-dot"></div>
              <span>{connected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
        </header>

        {/* Alert Banner - Two Stage System */}
        <div className={`alert-banner alert-${alertLevel}`}>
          <div className="alert-content">
            <svg className="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {alertLevel === 'critical' ? (
                <><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></>
              ) : alertLevel === 'warning' ? (
                <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></>
              ) : (
                <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></>
              )}
            </svg>
            <div className="alert-text">
              <h2 className="alert-title">
                {alertLevel === 'critical' ? 'CRITICAL ALERT - Immediate Evacuation Required' :
                 alertLevel === 'warning' ? 'WARNING - Unstable Conditions Detected' :
                 'SAFE - Normal Conditions'}
              </h2>
              <p className="alert-description">
                {alertLevel === 'critical' ? 'High landslide risk detected. Take immediate action!' :
                 alertLevel === 'warning' ? 'Elevated landslide risk. Monitor closely and prepare for evacuation.' :
                 'All parameters within safe range.'}
              </p>
              {alertLevel === "critical" && (
                <div className="alert-stage stage-critical">
                  <p className="stage-title">⚠️ STAGE 2 ALERT: Multiple risk factors detected</p>
                  <p className="stage-description">Contact emergency services and evacuate to safe zones immediately.</p>
                </div>
              )}
              {alertLevel === "warning" && (
                <div className="alert-stage stage-warning">
                  <p className="stage-title">⚠️ STAGE 1 ALERT: Warning conditions detected</p>
                  <p className="stage-description">Stay alert and prepare emergency evacuation plan.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="dashboard-grid">
          {/* Environment Data */}
          <div className="dashboard-card">
            <div className="card-header">
              <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"></path>
              </svg>
              <h3>Environment</h3>
            </div>
            <div className="card-body">
              <div className="data-row">
                <span className="data-label">Temperature</span>
                <span className="data-value">{data.temperature ?? "—"} °C</span>
              </div>
              <div className="data-row">
                <span className="data-label">Humidity</span>
                <span className="data-value">{data.humidity ?? "—"} %</span>
              </div>
              <div className="data-row">
                <span className="data-label">Heat Index</span>
                <span className="data-value">{data.heatIndex ?? "—"}</span>
              </div>
            </div>
          </div>

          {/* Surface Moisture */}
          <div className="dashboard-card">
            <div className="card-header">
              <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
              </svg>
              <h3>Surface Moisture</h3>
            </div>
            <div className="card-body">
              <div className="data-row">
                <span className="data-label">Surface Level</span>
                <span className="data-value">{data.surfaceMoisturePercent ?? "—"} %</span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${(data.surfaceMoisturePercent > 70) ? 'progress-danger' : 'progress-normal'}`}
                  style={{ width: `${Math.min(data.surfaceMoisturePercent || 0, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Depth Moisture */}
          <div className="dashboard-card">
            <div className="card-header">
              <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
              </svg>
              <h3>Depth Moisture</h3>
            </div>
            <div className="card-body">
              <div className="data-row">
                <span className="data-label">Deep Level</span>
                <span className="data-value">{data.depthMoisturePercent ?? "—"} %</span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${(data.depthMoisturePercent > 60) ? 'progress-danger' : 'progress-deep'}`}
                  style={{ width: `${Math.min(data.depthMoisturePercent || 0, 100)}%` }}
                ></div>
              </div>
              <div className="data-row border-top">
                <span className="data-label">Needs Watering</span>
                <span className={`data-value ${data.needsWatering ? 'text-warning' : 'text-success'}`}>
                  {data.needsWatering ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Tilt & Stability */}
          <div className="dashboard-card">
            <div className="card-header">
              <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <h3>Tilt Status</h3>
            </div>
            <div className="card-body">
              <div className="data-row">
                <span className="data-label">Currently Tilted</span>
                <span className={`data-value ${data.isTilted ? 'text-danger' : 'text-success'}`}>
                  {data.isTilted ? "YES" : "NO"}
                </span>
              </div>
              <div className="data-row">
                <span className="data-label">Tilt Events</span>
                <span className={`data-value ${(data.tiltCount > 5) ? 'text-danger' : ''}`}>
                  {data.tiltCount ?? 0}
                </span>
              </div>
              {data.isTilted && (
                <div className="tilt-warning">
                  <p>⚠️ Active tilt detected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="timestamp-footer">
          <svg className="timestamp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Last Updated: {data.timestamp ? new Date(data.timestamp).toLocaleString() : "—"}</span>
        </div>
      </div>

      {/* Critical Alert Overlay */}
      {alertLevel === "critical" && (
        <div className="critical-overlay"></div>
      )}
    </div>

    <Advanced   data={data}/>
  </>
  );
}