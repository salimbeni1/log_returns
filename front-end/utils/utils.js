
export function getServerPath() {
    const dev = process.env.NODE_ENV !== 'production';
    return dev ? 'http://localhost:3000/' : 'https://log-returns.vercel.app/';
}
  
