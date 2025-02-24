import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "./components/Loading";

function LoadingWrapper({ children }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust loading time as needed

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loading />}
      {children}
    </>
  );
}

export default LoadingWrapper;
