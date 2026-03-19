import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { UserProfile } from '../models/merchant.models';

type AuthStep = 'logged-out' | 'password-ok' | 'locked' | 'verified';

interface AuthState {
  mobileNumber: string;
  step: AuthStep;
  stepUpToken: string;
  accessToken: string;
  refreshToken: string;
  profile: UserProfile | null;
}

interface LoginResponse {
  stepUpToken: string;
  requiresMpin: boolean;
  expiresUtc: string;
}

interface SessionResponse {
  accessToken: string;
  refreshToken: string;
  expiresUtc: string;
  me: UserProfile;
}

const STORAGE_KEY = 'pari-merchant-auth';

@Injectable({ providedIn: 'root' })
export class AuthFlowService {
  private readonly http = inject(HttpClient);

  private readonly state = signal<AuthState>(this.restoreState());
  readonly loading = signal(false);

  readonly accessToken = computed(() => this.state().accessToken);
  readonly mobileNumber = computed(() => this.state().mobileNumber);
  readonly canAccessMpin = computed(
    () => this.state().step === 'password-ok' || this.state().step === 'locked' || this.state().step === 'verified'
  );
  readonly canAccessDashboard = computed(() => this.state().step === 'verified' && !!this.state().accessToken);
  readonly userProfile = computed(() => this.state().profile);
  readonly isLocked = computed(() => this.state().step === 'locked');

  readonly userId = computed(() => this.state().profile?.merchantCode ?? 'MER1001');
  readonly avatarInitials = computed(() => {
    const name = this.state().profile?.displayName?.trim() ?? 'DM';
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  });
  readonly profileName = computed(() => this.state().profile?.displayName ?? 'Merchant User');
  readonly profileRole = computed(() => this.state().profile?.role ?? 'Retailer');
  readonly profilePhone = computed(() => this.state().profile?.phone ?? this.state().mobileNumber);
  readonly profileEmail = computed(() => this.state().profile?.email ?? 'merchant@pari.test');

  async submitLogin(mobileNumber: string, password: string): Promise<void> {
    this.loading.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, {
          mobileNumber,
          password
        })
      );

      this.state.set({
        mobileNumber,
        step: response.requiresMpin ? 'password-ok' : 'verified',
        stepUpToken: response.stepUpToken,
        accessToken: '',
        refreshToken: '',
        profile: null
      });
      this.persistState();
    } finally {
      this.loading.set(false);
    }
  }

  async verifyMpin(mpin: string): Promise<boolean> {
    if (!/^\d{6}$/.test(mpin)) {
      return false;
    }

    this.loading.set(true);

    try {
      if (this.state().stepUpToken) {
        const response = await firstValueFrom(
          this.http.post<SessionResponse>(`${API_BASE_URL}/api/auth/mpin/verify`, {
            stepUpToken: this.state().stepUpToken,
            mpin
          })
        );

        this.state.update((current) => ({
          ...current,
          step: 'verified',
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          profile: response.me
        }));
      } else if (this.state().accessToken) {
        const profile = await firstValueFrom(
          this.http.post<UserProfile>(`${API_BASE_URL}/api/auth/mpin/unlock`, {
            mpin
          })
        );

        this.state.update((current) => ({
          ...current,
          step: 'verified',
          profile
        }));
      } else {
        return false;
      }

      this.persistState();
      return true;
    } catch {
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async refreshSession(): Promise<boolean> {
    const refreshToken = this.state().refreshToken;

    if (!refreshToken) {
      return false;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<SessionResponse>(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken
        })
      );

      this.state.update((current) => ({
        ...current,
        step: 'verified',
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        profile: response.me
      }));
      this.persistState();
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  async loadMe(): Promise<void> {
    if (!this.state().accessToken) {
      return;
    }

    const profile = await firstValueFrom(this.http.get<UserProfile>(`${API_BASE_URL}/api/auth/me`));
    this.state.update((current) => ({ ...current, profile }));
    this.persistState();
  }

  async updateProfile(displayName: string, email: string, phone: string): Promise<UserProfile> {
    const profile = await firstValueFrom(
      this.http.put<UserProfile>(`${API_BASE_URL}/api/auth/me`, {
        displayName,
        email,
        phone
      })
    );

    this.state.update((current) => ({ ...current, profile }));
    this.persistState();
    return profile;
  }

  async updateMpin(oldMpin: string, newMpin: string, confirmMpin: string): Promise<void> {
    await firstValueFrom(
      this.http.post(`${API_BASE_URL}/api/auth/mpin/update`, {
        oldMpin,
        newMpin,
        confirmMpin
      })
    );
  }

  lockScreen(): void {
    if (!this.state().accessToken) {
      return;
    }

    this.state.update((current) => ({
      ...current,
      step: 'locked'
    }));
    this.persistState();
  }

  logout(): void {
    const refreshToken = this.state().refreshToken;

    if (refreshToken) {
      this.http.post(`${API_BASE_URL}/api/auth/logout`, { refreshToken }).subscribe({ error: () => undefined });
    }

    this.state.set({
      mobileNumber: '',
      step: 'logged-out',
      stepUpToken: '',
      accessToken: '',
      refreshToken: '',
      profile: null
    });
    localStorage.removeItem(STORAGE_KEY);
  }

  private restoreState(): AuthState {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        mobileNumber: '',
        step: 'logged-out',
        stepUpToken: '',
        accessToken: '',
        refreshToken: '',
        profile: null
      };
    }

    try {
      return JSON.parse(raw) as AuthState;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return {
        mobileNumber: '',
        step: 'logged-out',
        stepUpToken: '',
        accessToken: '',
        refreshToken: '',
        profile: null
      };
    }
  }

  private persistState(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state()));
  }
}
