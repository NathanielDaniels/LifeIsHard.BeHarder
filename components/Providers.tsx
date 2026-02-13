'use client';

// ============================================
// Combined Providers Wrapper
// Wraps children with both Vitality and WHOOP contexts
// ============================================

import { ReactNode } from 'react';
import { VitalityProvider } from '@/contexts/VitalityContext';
import { WhoopProvider } from '@/contexts/WhoopContext';

interface ProvidersProps {
  children: ReactNode;
  /** Force demo mode for WHOOP (useful for testing) */
  whoopDemoMode?: boolean;
  /** WHOOP polling interval in ms (default: 5 min, 0 to disable) */
  whoopPollInterval?: number;
}

export function Providers({ 
  children, 
  whoopDemoMode = false,
  whoopPollInterval = 5 * 60 * 1000,
}: ProvidersProps) {
  return (
    <VitalityProvider>
      <WhoopProvider 
        forceDemo={whoopDemoMode}
        pollInterval={whoopPollInterval}
      >
        {children}
      </WhoopProvider>
    </VitalityProvider>
  );
}

// ============================================
// Usage in layout.tsx:
// ============================================
// 
// import { Providers } from '@/components/Providers';
// 
// export default function RootLayout({ children }) {
//   return (
//     <html>
//       <body>
//         <Providers>
//           {children}
//         </Providers>
//       </body>
//     </html>
//   );
// }
