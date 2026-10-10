/**
 * Native Bridge for HB Universe
 * Unifies Mobile (Capacitor), Desktop (Electron), and Web environments.
 */

declare global {
  interface Window {
    electronAPI?: {
      isDesktop: boolean;
      minimize: () => Promise<void>;
      maximize: () => Promise<void>;
      close: () => Promise<void>;
      isMaximized: () => Promise<boolean>;
      getPlatform: () => Promise<string>;
    };
    Capacitor?: {
      isNativePlatform: () => boolean;
      getPlatform: () => string;
    };
  }
}

export type PlatformType = 'web' | 'ios' | 'android' | 'electron';

export class NativeBridge {
  static getPlatform(): PlatformType {
    if (typeof window === 'undefined') return 'web';
    if (window.electronAPI?.isDesktop) return 'electron';
    if (window.Capacitor?.isNativePlatform()) {
      return (window.Capacitor.getPlatform() as PlatformType) || 'android';
    }
    return 'web';
  }

  static isNativeMobile(): boolean {
    const platform = this.getPlatform();
    return platform === 'ios' || platform === 'android';
  }

  static isDesktopApp(): boolean {
    return this.getPlatform() === 'electron';
  }

  // Trigger light/medium vibration feedback on mobile touch
  static async hapticFeedback(style: 'light' | 'medium' | 'heavy' = 'light') {
    if (this.isNativeMobile()) {
      try {
        const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
        const map = {
          light: ImpactStyle.Light,
          medium: ImpactStyle.Medium,
          heavy: ImpactStyle.Heavy
        };
        await Haptics.impact({ style: map[style] });
      } catch {
        // Fallback to navigator.vibrate if supported
        if ('vibrate' in navigator) {
          navigator.vibrate(style === 'heavy' ? 40 : style === 'medium' ? 25 : 15);
        }
      }
    } else if ('vibrate' in navigator) {
      navigator.vibrate(style === 'heavy' ? 40 : style === 'medium' ? 25 : 15);
    }
  }

  // Initialize native mobile status bar and splash screen if running in Capacitor
  static async initNativeMobile() {
    if (this.isNativeMobile()) {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#050505' });
        await StatusBar.setOverlaysWebView({ overlay: true });
      } catch (err) {
        console.warn('Native status bar initialization note:', err);
      }

      try {
        const { SplashScreen } = await import('@capacitor/splash-screen');
        await SplashScreen.hide();
      } catch (err) {
        console.warn('Native splash screen note:', err);
      }
    }
  }

  // Desktop window controls
  static async minimizeWindow() {
    if (window.electronAPI) {
      await window.electronAPI.minimize();
    }
  }

  static async maximizeWindow() {
    if (window.electronAPI) {
      await window.electronAPI.maximize();
    }
  }

  static async closeWindow() {
    if (window.electronAPI) {
      await window.electronAPI.close();
    }
  }
}
