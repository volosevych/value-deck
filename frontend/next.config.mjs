/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone", // Use dynamic rendering
    experimental: {
      appDir: true, // Enable app directory if you're using it
    },
  };
  
  export default nextConfig;
  