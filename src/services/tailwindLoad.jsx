// Carga Tailwind CSS dinámicamente desde CDN
const loadTailwind = () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    script.onload = () => {
    };
    document.head.appendChild(script);
  };
  
  loadTailwind();