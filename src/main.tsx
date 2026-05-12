import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Auto-recover from stale dynamic-import chunks after a deploy/HMR rebuild.
const isChunkLoadError = (msg: unknown) =>
  typeof msg === 'string' &&
  (msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module'));

const reloadOnce = () => {
  const KEY = '__sba_chunk_reload__';
  if (sessionStorage.getItem(KEY)) return;
  sessionStorage.setItem(KEY, '1');
  window.location.reload();
};

window.addEventListener('error', (e) => {
  if (isChunkLoadError(e?.message)) reloadOnce();
});
window.addEventListener('unhandledrejection', (e) => {
  if (isChunkLoadError((e?.reason as any)?.message)) reloadOnce();
});

createRoot(document.getElementById("root")!).render(<App />);
