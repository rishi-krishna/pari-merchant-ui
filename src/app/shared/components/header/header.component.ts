import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthFlowService } from '../../../core/services/auth-flow.service';
import { MerchantDataService } from '../../../core/services/merchant-data.service';
import { AppIconComponent } from '../../app-icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly router = inject(Router);
  readonly auth = inject(AuthFlowService);
  readonly data = inject(MerchantDataService);
  readonly profileOpen = signal(false);

  constructor() {
    void this.auth.loadMe().catch(() => undefined);
    void this.data.loadWalletSummary().catch(() => undefined);
  }

  @HostListener('document:click')
  closeProfileMenu(): void {
    this.profileOpen.set(false);
  }

  toggleProfile(event: MouseEvent): void {
    event.stopPropagation();
    this.profileOpen.update((value) => !value);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
