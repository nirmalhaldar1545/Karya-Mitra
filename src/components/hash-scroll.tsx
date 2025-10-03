"use client";

import { useEffect, useRef } from "react";

export function HashScroll() {
  const hasRefreshed = useRef(false);

  useEffect(() => {
    const hash = window.location.hash;
    
    // Check if we need to refresh (hash exists and haven't refreshed yet)
    const needsRefresh = sessionStorage.getItem('hashScrollRefresh');
    
    if (hash && needsRefresh === 'pending') {
      // We just navigated with a hash, scroll and then refresh
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
          
          // Mark as refreshed and reload
          sessionStorage.setItem('hashScrollRefresh', 'done');
          setTimeout(() => {
            window.location.reload();
          }, 600);
        }
      }, 100);
    } else if (hash && !needsRefresh) {
      // First time visiting with hash, mark for refresh
      sessionStorage.setItem('hashScrollRefresh', 'pending');
      
      // Scroll to element
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
          
          // Trigger refresh after scroll
          setTimeout(() => {
            window.location.reload();
          }, 600);
        }
      }, 100);
    } else if (needsRefresh === 'done') {
      // Clean up after refresh is complete
      sessionStorage.removeItem('hashScrollRefresh');
    }

    // Handle hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash;
      if (newHash) {
        sessionStorage.setItem('hashScrollRefresh', 'pending');
        setTimeout(() => {
          const element = document.querySelector(newHash);
          if (element) {
            const yOffset = -80;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
            
            setTimeout(() => {
              window.location.reload();
            }, 600);
          }
        }, 100);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return null;
}
