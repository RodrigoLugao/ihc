// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "document.documentElement.scrollTo" para navegadores modernos
    // "document.body.scrollTop" para compatibilidade com IE/Edge
    // Ou simplesmente window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      console.log(
        "Scrolled to top for:",
        pathname,
        "current scroll:",
        window.scrollY
      );
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]); // Re-executa sempre que o pathname (rota) muda

  return null; // Este componente não renderiza nada no DOM
}

export default ScrollToTop;
