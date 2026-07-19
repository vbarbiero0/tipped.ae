/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/bills-paid", destination: "/transparency", permanent: true },
      { source: "/cats", destination: "/adopt", permanent: true },
      { source: "/cats/:ref", destination: "/adopt/:ref", permanent: true },
    ];
  },
};

export default nextConfig;
