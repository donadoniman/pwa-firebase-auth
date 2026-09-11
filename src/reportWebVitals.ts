import type { Metric } from 'web-vitals';

// web-vitals v3 renamed every getXXX() to onXXX() and dropped the shared
// ReportHandler type (each onXXX now takes its own metric-specific
// callback type, e.g. (metric: CLSMetric) => void -- Metric is their
// common base, which a single shared callback can still satisfy). v5
// removed onFID entirely -- Chrome deprecated FID as a Core Web Vital in
// March 2024 in favor of onINP, which replaces it below.
const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFCP(onPerfEntry);
      onINP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
