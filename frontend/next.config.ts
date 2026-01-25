import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/auth/:path*', destination: 'http://localhost:8000/auth/:path*' },
      { source: '/master/:path*', destination: 'http://localhost:8000/master/:path*' },
      { source: '/patients/:path*', destination: 'http://localhost:8000/patients/:path*' },
      { source: '/opd/:path*', destination: 'http://localhost:8000/opd/:path*' },
      { source: '/er/:path*', destination: 'http://localhost:8000/er/:path*' },
      { source: '/clinical/:path*', destination: 'http://localhost:8000/clinical/:path*' },
      { source: '/orders/:path*', destination: 'http://localhost:8000/orders/:path*' },
      { source: '/lab/:path*', destination: 'http://localhost:8000/lab/:path*' },
      { source: '/pharmacy/:path*', destination: 'http://localhost:8000/pharmacy/:path*' },
      { source: '/billing/:path*', destination: 'http://localhost:8000/billing/:path*' },
      { source: '/general/:path*', destination: 'http://localhost:8000/general/:path*' },
      { source: '/facility/:path*', destination: 'http://localhost:8000/facility/:path*' },
      { source: '/appointments/:path*', destination: 'http://localhost:8000/appointments/:path*' },
      { source: '/ipd/:path*', destination: 'http://localhost:8000/ipd/:path*' },
      { source: '/ai/:path*', destination: 'http://localhost:8000/ai/:path*' },
    ];
  },
};

export default nextConfig;
