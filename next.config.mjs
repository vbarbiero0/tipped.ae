/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/bills-paid", destination: "/transparency", permanent: true },
      { source: "/cats", destination: "/pets", permanent: true },
      { source: "/cats/:ref", destination: "/pets/:ref", permanent: true },
      { source: "/adopt", destination: "/pets", permanent: true },
      { source: "/adopt/:ref", destination: "/pets/:ref", permanent: true },
      { source: "/advice", destination: "/blog", permanent: true },
      { source: "/advice/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
