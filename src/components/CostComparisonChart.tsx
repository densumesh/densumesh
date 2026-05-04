import { useState, useRef, useCallback, useMemo } from 'react';

const CONVERSATIONS = 850_000;
const HOURLY_RATE = 0.0823; // 1 vCPU + 2 GiB RAM
const MAX_MINUTES = 15;
const STEPS = 60;
const CHROMAFS_ANNUAL = 0;

const CHART = { w: 640, h: 340, pt: 32, pr: 24, pb: 52, pl: 72 };
const PLOT = {
  x: CHART.pl,
  y: CHART.pt,
  w: CHART.w - CHART.pl - CHART.pr,
  h: CHART.h - CHART.pt - CHART.pb,
};

function annualCost(minutes: number) {
  return CONVERSATIONS * (minutes / 60) * HOURLY_RATE * 12;
}

const maxCost = annualCost(MAX_MINUTES);

const Y_TICKS = [0, 50_000, 100_000, 150_000, 200_000];

function fmt(v: number) {
  if (v === 0) return '$0';
  return `$${(v / 1_000).toFixed(0)}k`;
}

function toX(minutes: number) {
  return PLOT.x + (minutes / MAX_MINUTES) * PLOT.w;
}
function toY(cost: number) {
  return PLOT.y + PLOT.h - (cost / maxCost) * PLOT.h;
}

const curvePath = (() => {
  const pts = Array.from({ length: STEPS + 1 }, (_, i) => {
    const m = (i / STEPS) * MAX_MINUTES;
    return `${toX(m).toFixed(1)},${toY(annualCost(m)).toFixed(1)}`;
  });
  return `M${pts.join('L')}`;
})();

const fillPath = `${curvePath}L${toX(MAX_MINUTES).toFixed(1)},${toY(0).toFixed(1)}L${toX(0).toFixed(1)},${toY(0).toFixed(1)}Z`;

export default function CostComparisonChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const hoverData = useMemo(() => {
    if (hover === null) return null;
    const minutes = Math.max(0, Math.min(MAX_MINUTES, hover));
    const docker = annualCost(minutes);
    return {
      minutes,
      docker,
      x: toX(minutes),
      yDocker: toY(docker),
      yChroma: toY(CHROMAFS_ANNUAL),
    };
  }, [hover]);

  const handleMove = useCallback((e: React.MouseEvent<SVGRectElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = CHART.w / rect.width;
    const px = (e.clientX - rect.left) * scaleX;
    const minutes = ((px - PLOT.x) / PLOT.w) * MAX_MINUTES;
    if (minutes < 0 || minutes > MAX_MINUTES) {
      setHover(null);
    } else {
      setHover(Math.round(minutes * 10) / 10);
    }
  }, []);

  return (
    <div style={{ width: '100%', fontFamily: 'var(--font-body, system-ui, sans-serif)' }}>
      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CHART.w} ${CHART.h}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible', userSelect: 'none' }}
        >
          {/* Y grid lines + labels */}
          {Y_TICKS.map((v) => (
            <g key={v}>
              <line
                x1={PLOT.x}
                y1={toY(v)}
                x2={PLOT.x + PLOT.w}
                y2={toY(v)}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeDasharray={v === 0 ? undefined : '3,3'}
              />
              <text
                x={PLOT.x - 12}
                y={toY(v)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={11}
                fill="currentColor"
                opacity={0.45}
              >
                {fmt(v)}
              </text>
            </g>
          ))}

          {/* X ticks */}
          {[0, 3, 5, 7, 10, 12, 15].map((m) => (
            <text
              key={m}
              x={toX(m)}
              y={PLOT.y + PLOT.h + 20}
              textAnchor="middle"
              fontSize={11}
              fill="currentColor"
              opacity={0.45}
            >
              {m}
            </text>
          ))}

          {/* Axis labels */}
          <text
            x={PLOT.x + PLOT.w / 2}
            y={CHART.h - 4}
            textAnchor="middle"
            fontSize={12}
            fill="currentColor"
            opacity={0.5}
          >
            Average session duration (minutes)
          </text>
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fontSize={12}
            fill="currentColor"
            opacity={0.5}
            transform={`translate(16, ${PLOT.y + PLOT.h / 2}) rotate(-90)`}
          >
            Additional annual compute cost
          </text>

          {/* Docker fill */}
          <path d={fillPath} fill="#E24B4A" opacity={0.06} />

          {/* Docker curve */}
          <path
            d={curvePath}
            fill="none"
            stroke="#E24B4A"
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {/* ChromaFs line */}
          <line
            x1={toX(0)}
            y1={toY(CHROMAFS_ANNUAL)}
            x2={toX(MAX_MINUTES)}
            y2={toY(CHROMAFS_ANNUAL)}
            stroke="#1D9E75"
            strokeWidth={2.5}
            strokeDasharray="6,4"
            strokeLinecap="round"
          />

          {/* Hover interaction layer */}
          <rect
            x={PLOT.x}
            y={PLOT.y}
            width={PLOT.w}
            height={PLOT.h}
            fill="transparent"
            onMouseMove={handleMove}
            onMouseLeave={() => setHover(null)}
            style={{ cursor: 'crosshair' }}
          />

          {/* Hover elements */}
          {hoverData && (
            <g>
              <line
                x1={hoverData.x}
                y1={PLOT.y}
                x2={hoverData.x}
                y2={PLOT.y + PLOT.h}
                stroke="currentColor"
                strokeOpacity={0.15}
                strokeDasharray="3,3"
              />
              <circle
                cx={hoverData.x}
                cy={hoverData.yDocker}
                r={4.5}
                fill="#E24B4A"
                stroke="white"
                strokeWidth={2}
              />
              <circle
                cx={hoverData.x}
                cy={hoverData.yChroma}
                r={4.5}
                fill="#1D9E75"
                stroke="white"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        {/* HTML Tooltip overlay */}
        {hoverData && (
          <div
            style={{
              position: 'absolute',
              left: `${(hoverData.x / CHART.w) * 100}%`,
              top: `${(Math.max(hoverData.yDocker - 8, PLOT.y) / CHART.h) * 100}%`,
              transform:
                hoverData.x > PLOT.x + PLOT.w * 0.65
                  ? 'translate(calc(-100% - 16px), -50%)'
                  : 'translate(16px, -50%)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <div
              style={{
                background: '#fff',
                color: '#1a1a1a',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 10,
                padding: '10px 14px',
                minWidth: 172,
                boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#888',
                  marginBottom: 8,
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}
              >
                {hoverData.minutes.toFixed(1)} min avg session
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12.5,
                      color: '#555',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#E24B4A',
                        flexShrink: 0,
                      }}
                    />
                    Sandbox
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                      color: '#E24B4A',
                    }}
                  >
                    ${Math.round(hoverData.docker).toLocaleString()}
                    <span style={{ fontWeight: 400, fontSize: 11, color: '#999' }}>/yr</span>
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 12.5,
                      color: '#555',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#1D9E75',
                        flexShrink: 0,
                      }}
                    />
                    ChromaFs
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                      color: '#1D9E75',
                    }}
                  >
                    $0
                    <span style={{ fontWeight: 400, fontSize: 11, color: '#999' }}>/yr</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '1.25rem',
          marginTop: '0.25rem',
          fontSize: '13px',
          color: 'var(--color-text-secondary, #a1a1aa)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: 14,
              height: 3,
              borderRadius: 1,
              background: '#E24B4A',
              display: 'inline-block',
            }}
          />
          Sandbox
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: 14,
              height: 0,
              borderTop: '2.5px dashed #1D9E75',
              display: 'inline-block',
            }}
          />
          ChromaFs
        </span>
      </div>
    </div>
  );
}
