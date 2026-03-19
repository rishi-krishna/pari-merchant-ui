import { Injectable } from '@angular/core';

import { cashfreeCheckoutMode, cashfreeSdkUrl } from '../config/payment-gateway.config';

type CashfreeMode = 'sandbox' | 'production';
type CashfreeRedirectTarget = '_modal' | '_self' | '_blank' | '_top' | HTMLElement;

interface CashfreeCheckoutInstance {
  checkout(options: {
    paymentSessionId: string;
    redirectTarget?: CashfreeRedirectTarget;
  }): Promise<unknown>;
}

declare global {
  interface Window {
    Cashfree?: (options: { mode: CashfreeMode }) => CashfreeCheckoutInstance;
    __pariCashfreeLoader__?: Promise<void>;
  }
}

@Injectable({ providedIn: 'root' })
export class CashfreeCheckoutService {
  private instancePromise: Promise<CashfreeCheckoutInstance> | null = null;

  async openModal(paymentSessionId: string): Promise<unknown> {
    const cashfree = await this.getInstance();
    return cashfree.checkout({
      paymentSessionId,
      redirectTarget: '_modal'
    });
  }

  private async getInstance(): Promise<CashfreeCheckoutInstance> {
    if (!this.instancePromise) {
      this.instancePromise = this.loadSdk().then(() => {
        if (!window.Cashfree) {
          throw new Error('Cashfree SDK failed to load.');
        }

        return window.Cashfree({ mode: cashfreeCheckoutMode });
      });
    }

    return this.instancePromise;
  }

  private async loadSdk(): Promise<void> {
    if (window.Cashfree) {
      return;
    }

    if (!window.__pariCashfreeLoader__) {
      window.__pariCashfreeLoader__ = new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${cashfreeSdkUrl}"]`);
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve(), { once: true });
          existingScript.addEventListener('error', () => reject(new Error('Unable to load Cashfree SDK.')), {
            once: true
          });
          return;
        }

        const script = document.createElement('script');
        script.src = cashfreeSdkUrl;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Unable to load Cashfree SDK.'));
        document.head.appendChild(script);
      });
    }

    return window.__pariCashfreeLoader__;
  }
}
