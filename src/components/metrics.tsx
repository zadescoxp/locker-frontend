"use Client"

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export default function Analytics() {
  useEffect(() => {
    // Ensure Clarity is available before initializing
    if (Clarity && Clarity.init) {
      const projectId = "pt5e0mrzpn";
      Clarity.init(projectId);
    } else {
      console.warn('Clarity is not available for initialization.');
    }
  }, []); // Empty dependency array ensures this runs only once

  return null; // This component doesn't render anything visible
}
