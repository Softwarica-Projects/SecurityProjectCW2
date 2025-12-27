import { useEffect, useRef } from 'react';

export function useRecaptcha() {
    const loadedRef = useRef(false);
    const lastExecutionRef = useRef(0);

    function loadRecaptcha(siteKey) {
        if (!siteKey) return;
        if (loadedRef.current) return;
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.id = 'recaptcha-script';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        loadedRef.current = true;
    }

    function unloadRecaptcha() {
        try {
            if (window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
                try { window.grecaptcha.reset(); } catch (e) { }
            }

            const el = document.getElementById('recaptcha-script');
            if (el && el.parentNode) el.parentNode.removeChild(el);

            try { delete window.grecaptcha; } catch (e) { window.grecaptcha = undefined; }
            try { delete window.___grecaptcha_cfg; } catch (e) { }

            loadedRef.current = false;
            lastExecutionRef.current = 0;
        } catch (e) {
        }
    }

    async function execute(siteKey, action = 'submit') {
        if (!siteKey) return null;

        const now = Date.now();
        const timeSinceLastExecution = now - lastExecutionRef.current;
        if (timeSinceLastExecution < 1000) {
            await new Promise(r => setTimeout(r, 1000 - timeSinceLastExecution));
        }

        try {
            await new Promise((resolve) => {
                if (window.grecaptcha && window.grecaptcha.ready) {
                    window.grecaptcha.ready(() => resolve());
                } else {
                    const start = Date.now();
                    const iv = setInterval(() => {
                        if (window.grecaptcha && window.grecaptcha.ready) {
                            clearInterval(iv);
                            window.grecaptcha.ready(() => resolve());
                        }
                        if (Date.now() - start > 3000) {
                            clearInterval(iv);
                            resolve();
                        }
                    }, 200);
                }
            });

            if (!window.grecaptcha || !window.grecaptcha.execute) {
                console.warn('grecaptcha not available');
                return null;
            }

            const token = await window.grecaptcha.execute(siteKey, { action });
            lastExecutionRef.current = Date.now();
            
            if (token) {
                // reCAPTCHA token generated
                return token;
            } else {
                console.warn('reCAPTCHA: execute returned null');
                return null;
            }
        } catch (e) {
            console.error('reCAPTCHA execution error:', e);
            return null;
        }
    }

    return { loadRecaptcha, execute, unloadRecaptcha };
}