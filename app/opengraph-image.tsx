import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'Vittesh Sinha, Senior Product Designer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#050505',
          color: '#f2efe6',
          padding: '64px 72px 56px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 22,
            letterSpacing: 3.2,
            textTransform: 'uppercase',
            color: '#F23828'
          }}
        >
          <span>Portfolio</span>
          <span>vittesh.com</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -2.4,
              lineHeight: 0.92
            }}
          >
            Vittesh Sinha
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              color: 'rgba(242, 239, 230, 0.72)'
            }}
          >
            Senior Product Designer
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 22,
            color: 'rgba(242, 239, 230, 0.52)'
          }}
        >
          <span>Automotive · Logistics · Cloud · VR</span>
          <span
            style={{
              display: 'flex',
              width: 72,
              height: 4,
              background: '#F23828'
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
