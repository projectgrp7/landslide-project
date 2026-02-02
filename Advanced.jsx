import React, { useState, useEffect } from 'react';
import './advanced.css';

function Advanced({ data = {} }) {
  const [prediction, setPrediction] = useState(null);
  const [riskHistory, setRiskHistory] = useState([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Responsive screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Analyze data and make predictions
  useEffect(() => {
    console.log("Received sensor data:", data);
    if (data && Object.keys(data).length > 0) {
      analyzeLandslideRisk();
    }
  }, [data]);

  const analyzeLandslideRisk = () => {
    const {
      depthMoisturePercent = 0,
      surfaceMoisturePercent = 0,
      humidity = 0,
      isTilted = false,
      tiltCount = 0,
      temperature = 0
    } = data;

    let riskScore = 0;
    let riskFactors = [];

    // Analyze each parameter
    if (isTilted) {
      riskScore += 25;
      riskFactors.push({ factor: 'Active Tilt', severity: 'Critical', score: 25 });
    }

    if (tiltCount > 5) {
      riskScore += 15;
      riskFactors.push({ factor: 'High Tilt Frequency', severity: 'High', score: 15 });
    }

    if (surfaceMoisturePercent > 70) {
      riskScore += 20;
      riskFactors.push({ factor: 'Saturated Surface', severity: 'High', score: 20 });
    } else if (surfaceMoisturePercent > 50) {
      riskScore += 10;
      riskFactors.push({ factor: 'High Surface Moisture', severity: 'Medium', score: 10 });
    }

    if (depthMoisturePercent > 60) {
      riskScore += 20;
      riskFactors.push({ factor: 'Deep Soil Saturation', severity: 'High', score: 20 });
    } else if (depthMoisturePercent > 45) {
      riskScore += 10;
      riskFactors.push({ factor: 'Elevated Deep Moisture', severity: 'Medium', score: 10 });
    }

    if (humidity > 80) {
      riskScore += 10;
      riskFactors.push({ factor: 'High Humidity', severity: 'Medium', score: 10 });
    }

    // Calculate prediction timeframe
    let timeframe = "Not Applicable";
    let predictionLevel = "Safe";
    let recommendations = [];

    if (riskScore >= 60) {
      predictionLevel = "Critical";
      timeframe = "0-6 hours";
      recommendations = [
        "Evacuate immediately to designated safe zones",
        "Contact emergency services (Dial 112)",
        "Alert all residents in affected areas",
        "Do not return until authorities declare it safe"
      ];
    } else if (riskScore >= 40) {
      predictionLevel = "High Risk";
      timeframe = "6-24 hours";
      recommendations = [
        "Prepare for immediate evacuation",
        "Monitor weather and ground conditions closely",
        "Keep emergency supplies ready",
        "Stay alert for evacuation orders"
      ];
    } else if (riskScore >= 20) {
      predictionLevel = "Moderate Risk";
      timeframe = "24-48 hours";
      recommendations = [
        "Continue monitoring conditions",
        "Review evacuation routes and plans",
        "Avoid steep slopes and unstable areas",
        "Keep communication channels open"
      ];
    } else {
      predictionLevel = "Low Risk";
      timeframe = "No immediate threat";
      recommendations = [
        "Continue routine monitoring",
        "Maintain drainage systems",
        "Regular sensor checks recommended",
        "Normal activities can continue"
      ];
    }

    setPrediction({
      riskScore,
      predictionLevel,
      timeframe,
      riskFactors,
      recommendations,
      timestamp: new Date().toISOString()
    });

    // Add to history
    setRiskHistory(prev => [...prev.slice(-9), {
      score: riskScore,
      level: predictionLevel,
      time: new Date().toLocaleTimeString()
    }]);

    setAnalysisComplete(true);
  };

  const downloadReport = (format) => {
    const reportData = {
      generatedAt: new Date().toLocaleString(),
      sensorData: data,
      prediction: prediction,
      systemInfo: {
        version: "1.0.0",
        location: "Monitoring Station Alpha"
      }
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      downloadFile(blob, `landslide-report-${Date.now()}.json`);
    } else if (format === 'csv') {
      const csv = generateCSV(reportData);
      const blob = new Blob([csv], { type: 'text/csv' });
      downloadFile(blob, `landslide-report-${Date.now()}.csv`);
    } else if (format === 'txt') {
      const txt = generateTextReport(reportData);
      const blob = new Blob([txt], { type: 'text/plain' });
      downloadFile(blob, `landslide-report-${Date.now()}.txt`);
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSV = (reportData) => {
    let csv = "Landslide Monitoring Report\n\n";
    csv += "Parameter,Value\n";
    csv += `Generated At,${reportData.generatedAt}\n`;
    csv += `Temperature,${reportData.sensorData.temperature || 'N/A'}\n`;
    csv += `Humidity,${reportData.sensorData.humidity || 'N/A'}\n`;
    csv += `Surface Moisture,${reportData.sensorData.surfaceMoisturePercent || 'N/A'}\n`;
    csv += `Depth Moisture,${reportData.sensorData.depthMoisturePercent || 'N/A'}\n`;
    csv += `Is Tilted,${reportData.sensorData.isTilted ? 'Yes' : 'No'}\n`;
    csv += `Tilt Count,${reportData.sensorData.tiltCount || 0}\n`;
    csv += `\nPrediction Analysis\n`;
    csv += `Risk Score,${reportData.prediction?.riskScore || 0}\n`;
    csv += `Risk Level,${reportData.prediction?.predictionLevel || 'Unknown'}\n`;
    csv += `Timeframe,${reportData.prediction?.timeframe || 'N/A'}\n`;
    return csv;
  };

  const generateTextReport = (reportData) => {
    let txt = "===============================================\n";
    txt += "    LANDSLIDE MONITORING SYSTEM REPORT\n";
    txt += "===============================================\n\n";
    txt += `Generated: ${reportData.generatedAt}\n`;
    txt += `System Version: ${reportData.systemInfo.version}\n`;
    txt += `Location: ${reportData.systemInfo.location}\n\n`;
    txt += "-----------------------------------------------\n";
    txt += "SENSOR READINGS\n";
    txt += "-----------------------------------------------\n";
    txt += `Temperature: ${reportData.sensorData.temperature || 'N/A'} °C\n`;
    txt += `Humidity: ${reportData.sensorData.humidity || 'N/A'} %\n`;
    txt += `Surface Moisture: ${reportData.sensorData.surfaceMoisturePercent || 'N/A'} %\n`;
    txt += `Depth Moisture: ${reportData.sensorData.depthMoisturePercent || 'N/A'} %\n`;
    txt += `Tilt Status: ${reportData.sensorData.isTilted ? 'ACTIVE' : 'STABLE'}\n`;
    txt += `Tilt Count: ${reportData.sensorData.tiltCount || 0}\n\n`;
    txt += "-----------------------------------------------\n";
    txt += "RISK ANALYSIS\n";
    txt += "-----------------------------------------------\n";
    txt += `Risk Score: ${reportData.prediction?.riskScore || 0}/100\n`;
    txt += `Risk Level: ${reportData.prediction?.predictionLevel || 'Unknown'}\n`;
    txt += `Predicted Timeframe: ${reportData.prediction?.timeframe || 'N/A'}\n\n`;
    
    if (reportData.prediction?.riskFactors?.length > 0) {
      txt += "Risk Factors Detected:\n";
      reportData.prediction.riskFactors.forEach((factor, idx) => {
        txt += `  ${idx + 1}. ${factor.factor} (${factor.severity}) - Score: ${factor.score}\n`;
      });
      txt += "\n";
    }

    if (reportData.prediction?.recommendations?.length > 0) {
      txt += "RECOMMENDATIONS:\n";
      reportData.prediction.recommendations.forEach((rec, idx) => {
        txt += `  ${idx + 1}. ${rec}\n`;
      });
    }

    txt += "\n===============================================\n";
    txt += "           END OF REPORT\n";
    txt += "===============================================\n";
    return txt;
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical': return '#ef4444';
      case 'High Risk': return '#f97316';
      case 'Moderate Risk': return '#f59e0b';
      case 'Low Risk': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'Critical': return 'severity-critical';
      case 'High': return 'severity-high';
      case 'Medium': return 'severity-medium';
      default: return 'severity-low';
    }
  };

  // Helper to get responsive grid classes
  const getGridClass = (baseClass) => {
    if (isMobile) return `${baseClass} mobile`;
    if (isTablet) return `${baseClass} tablet`;
    return `${baseClass} desktop`;
  };

  // Helper for history bars: limit visible bars on mobile
  const visibleHistory = isMobile ? riskHistory.slice(-5) : riskHistory;

  return (
    <div className="advanced-container">
      <div className="advanced-wrapper">
        <header className="advanced-header">
          <h1>Advanced Analytics & Reports</h1>
          <p>Predictive analysis and comprehensive reporting for landslide monitoring</p>
        </header>

        {/* Current Analysis */}
        <div className="analysis-section">
          <h2>Current Risk Analysis</h2>
          
          {analysisComplete && prediction ? (
            <div className={getGridClass("analysis-grid")}>
              {/* Risk Score Card */}
              <div className="analysis-card risk-score-card">
                <h3>Risk Assessment</h3>
                <div className="risk-score-display">
                  <div className="score-circle" style={{ background: `conic-gradient(${getRiskColor(prediction.predictionLevel)} ${prediction.riskScore}%, #1e293b ${prediction.riskScore}%)` }}>
                    <div className="score-inner">
                      <span className="score-number">{prediction.riskScore}</span>
                      <span className="score-label">/100</span>
                    </div>
                  </div>
                  <div className="risk-level" style={{ color: getRiskColor(prediction.predictionLevel) }}>
                    {prediction.predictionLevel}
                  </div>
                </div>
              </div>

              {/* Prediction Timeline */}
              <div className="analysis-card timeline-card">
                <h3>Predicted Timeframe</h3>
                <div className="timeline-content">
                  <svg className="timeline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <div className="timeline-text">
                    <p className="timeline-label">Potential Event Window</p>
                    <p className="timeline-value">{prediction.timeframe}</p>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="analysis-card factors-card">
                <h3>Detected Risk Factors</h3>
                {prediction.riskFactors.length > 0 ? (
                  <div className="factors-list">
                    {prediction.riskFactors.map((factor, idx) => (
                      <div key={idx} className="factor-item">
                        <div className="factor-header">
                          <span className="factor-name">{factor.factor}</span>
                          <span className={`factor-severity ${getSeverityClass(factor.severity)}`}>
                            {factor.severity}
                          </span>
                        </div>
                        <div className="factor-bar">
                          <div className="factor-fill" style={{ width: `${(factor.score / 25) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-factors">No significant risk factors detected</p>
                )}
              </div>

              {/* Recommendations */}
              <div className="analysis-card recommendations-card">
                <h3>Safety Recommendations</h3>
                <div className="recommendations-list">
                  {prediction.recommendations.map((rec, idx) => (
                    <div key={idx} className="recommendation-item">
                      <svg className="rec-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-data-message">
              <svg className="no-data-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <p>Waiting for sensor data to perform analysis...</p>
            </div>
          )}
        </div>

        {/* Risk History */}
        {riskHistory.length > 0 && (
          <div className="history-section">
            <h2>Risk Score History</h2>
            <div className={`history-chart ${isMobile ? 'mobile' : ''}`}>
              {visibleHistory.map((entry, idx) => (
                <div key={idx} className="history-bar-wrapper">
                  <div 
                    className="history-bar" 
                    style={{ 
                      height: `${entry.score}%`,
                      background: getRiskColor(entry.level)
                    }}
                  >
                    <span className="bar-label">{entry.score}</span>
                  </div>
                  <span className="bar-time">{entry.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Download Reports */}
        <div className="reports-section">
          <h2>Download Reports</h2>
          <p className="reports-subtitle">Export comprehensive analysis in multiple formats</p>
          
          <div className={getGridClass("download-grid")}>
            <button className="download-btn json-btn" onClick={() => downloadReport('json')}>
              <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <div className="btn-content">
                <span className="btn-title">JSON Report</span>
                <span className="btn-subtitle">Machine-readable format</span>
              </div>
            </button>

            <button className="download-btn csv-btn" onClick={() => downloadReport('csv')}>
              <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <div className="btn-content">
                <span className="btn-title">CSV Report</span>
                <span className="btn-subtitle">Spreadsheet compatible</span>
              </div>
            </button>

            <button className="download-btn txt-btn" onClick={() => downloadReport('txt')}>
              <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <div className="btn-content">
                <span className="btn-title">Text Report</span>
                <span className="btn-subtitle">Human-readable format</span>
              </div>
            </button>
          </div>
        </div>

        {/* Current Sensor Data */}
        <div className="sensor-data-section">
          <h2>Current Sensor Data</h2>
          <div className={getGridClass("sensor-grid")}>
            <div className="sensor-item">
              <span className="sensor-label">Temperature</span>
              <span className="sensor-value">{data.temperature || '—'} °C</span>
            </div>
            <div className="sensor-item">
              <span className="sensor-label">Humidity</span>
              <span className="sensor-value">{data.humidity || '—'} %</span>
            </div>
            <div className="sensor-item">
              <span className="sensor-label">Surface Moisture</span>
              <span className="sensor-value">{data.surfaceMoisturePercent || '—'} %</span>
            </div>
            <div className="sensor-item">
              <span className="sensor-label">Depth Moisture</span>
              <span className="sensor-value">{data.depthMoisturePercent || '—'} %</span>
            </div>
            <div className="sensor-item">
              <span className="sensor-label">Tilt Status</span>
              <span className={`sensor-value ${data.isTilted ? 'status-danger' : 'status-safe'}`}>
                {data.isTilted ? 'Active' : 'Stable'}
              </span>
            </div>
            <div className="sensor-item">
              <span className="sensor-label">Tilt Count</span>
              <span className="sensor-value">{data.tiltCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Advanced;