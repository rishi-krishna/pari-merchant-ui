import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss'
})
export class DashboardShellComponent {
  private readonly router = inject(Router);

  readonly isMobile = signal(typeof window !== 'undefined' ? window.innerWidth < 1100 : false);
  readonly mobileSidebarOpen = signal(false);

  private readonly routeMeta = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.resolveRouteMeta()),
      startWith(this.resolveRouteMeta())
    ),
    { initialValue: this.resolveRouteMeta() }
  );

  readonly breadcrumbs = computed(() => this.routeMeta().breadcrumbs);
  readonly currentTitle = computed(() => {
    const crumbs = this.breadcrumbs();
    return crumbs[crumbs.length - 1] ?? 'Dashboard';
  });

  @HostListener('window:resize')
  onResize(): void {
    const mobile = window.innerWidth < 1100;
    this.isMobile.set(mobile);

    if (!mobile) {
      this.mobileSidebarOpen.set(false);
    }
  }

  toggleSidebar(): void {
    if (this.isMobile()) {
      this.mobileSidebarOpen.update((value) => !value);
    }
  }

  closeSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  private resolveRouteMeta(): { breadcrumbs: string[] } {
    let snapshot = this.router.routerState.snapshot.root;

    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }

    const configuredBreadcrumbs = snapshot.data['breadcrumbs'];

    if (Array.isArray(configuredBreadcrumbs) && configuredBreadcrumbs.length) {
      return { breadcrumbs: configuredBreadcrumbs };
    }

    const label =
      snapshot.data['label'] ?? (typeof snapshot.routeConfig?.title === 'string' ? snapshot.routeConfig.title : 'Dashboard');

    return { breadcrumbs: [label] };
  }
}
