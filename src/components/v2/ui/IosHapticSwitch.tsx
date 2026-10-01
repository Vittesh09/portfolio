'use client';

import { useEffect, useState } from 'react';
import { isIosDevice } from '@/src/components/v2/ui/haptics';

/** A real switch under the finger. iOS only haptics when the tap lands on one. */
export function IosHapticSwitch({ onActivate }: { onActivate: () => void }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isIosDevice());
  }, []);

  if (!enabled) return null;

  return (
    <input
      type="checkbox"
      aria-hidden="true"
      tabIndex={-1}
      className="v2-ios-haptic-switch"
      ref={(node) => {
        node?.setAttribute('switch', '');
      }}
      onClick={(event) => {
        event.stopPropagation();
        onActivate();
      }}
    />
  );
}
