import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <span class="icon-host" [style.width.px]="size()" [style.height.px]="size()">
      @switch (name()) {
        @case ('dashboard') { <svg viewBox="0 0 24 24" fill="none"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5 10.5V20h14v-9.5"></path></svg> }
        @case ('kyc') { <svg viewBox="0 0 24 24" fill="none"><path d="M12 3 6 5.5v5.8c0 4.4 2.4 7.7 6 9.7 3.6-2 6-5.3 6-9.7V5.5L12 3Z"></path><path d="m9.3 12.2 1.8 1.8 3.8-4"></path></svg> }
        @case ('calculator') { <svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3.5" width="14" height="17" rx="2.5"></rect><path d="M8 8.5h8"></path><path d="M8 12.5h2"></path><path d="M14 12.5h2"></path><path d="M8 16.5h2"></path><path d="M14 16.5h2"></path></svg> }
        @case ('percent') { <svg viewBox="0 0 24 24" fill="none"><path d="m18 6-12 12"></path><circle cx="7.5" cy="7.5" r="2.5"></circle><circle cx="16.5" cy="16.5" r="2.5"></circle></svg> }
        @case ('contacts') { <svg viewBox="0 0 24 24" fill="none"><path d="M9 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M16.5 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M4.5 18c.7-2.5 2.7-4 4.5-4s3.8 1.5 4.5 4"></path><path d="M13.5 17.5c.5-1.8 1.9-3 3.4-3 1.4 0 2.7 1.2 3.1 3"></path></svg> }
        @case ('bank') { <svg viewBox="0 0 24 24" fill="none"><path d="M3 9.5 12 4l9 5.5"></path><path d="M5 10.5h14"></path><path d="M6.5 10.5v7"></path><path d="M10.5 10.5v7"></path><path d="M14.5 10.5v7"></path><path d="M18.5 10.5v7"></path><path d="M4 19.5h16"></path></svg> }
        @case ('receipt') { <svg viewBox="0 0 24 24" fill="none"><path d="M7 4h10v16l-2-1.5L12 20l-3-1.5L7 20V4Z"></path><path d="M9.5 8.5h5"></path><path d="M9.5 12h5"></path></svg> }
        @case ('list') { <svg viewBox="0 0 24 24" fill="none"><path d="M9 7h10"></path><path d="M9 12h10"></path><path d="M9 17h10"></path><path d="M5 7h.01"></path><path d="M5 12h.01"></path><path d="M5 17h.01"></path></svg> }
        @case ('complaint') { <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8"></circle><path d="M12 8v5"></path><path d="M12 16.5h.01"></path></svg> }
        @case ('card') { <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2.5"></rect><path d="M3 10h18"></path><path d="M7 14h4"></path></svg> }
        @case ('payout') { <svg viewBox="0 0 24 24" fill="none"><path d="M4 8h10a3 3 0 0 1 0 6H6"></path><path d="M4 16h10a3 3 0 0 0 0-6H6"></path><path d="m15 8 5 4-5 4"></path></svg> }
        @case ('rupee') { <svg viewBox="0 0 24 24" fill="none"><path d="M7 6h9"></path><path d="M7 10h9"></path><path d="M11 18 7 10h5a3 3 0 1 0 0-6"></path></svg> }
        @case ('reports') { <svg viewBox="0 0 24 24" fill="none"><path d="M5 19V9"></path><path d="M12 19V5"></path><path d="M19 19v-7"></path></svg> }
        @case ('wallet') { <svg viewBox="0 0 24 24" fill="none"><path d="M5 7h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"></path><path d="M16 12h4"></path><path d="M7 7V6a2 2 0 0 1 2-2h8"></path></svg> }
        @case ('phone') { <svg viewBox="0 0 24 24" fill="none"><path d="M7 5h3l1.5 4-2 1.5a14 14 0 0 0 4 4l1.5-2L19 14v3a2 2 0 0 1-2 2A15 15 0 0 1 5 7a2 2 0 0 1 2-2Z"></path></svg> }
        @case ('ticket') { <svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14v4a2 2 0 0 0 0 4v4H5v-4a2 2 0 0 0 0-4V7Z"></path><path d="M12 7v10"></path></svg> }
        @case ('book') { <svg viewBox="0 0 24 24" fill="none"><path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5V5.5Z"></path><path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H19"></path></svg> }
        @case ('menu') { <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg> }
        @case ('bell') { <svg viewBox="0 0 24 24" fill="none"><path d="M15 18H9l-1-2v-4.5a4 4 0 0 1 8 0V16l-1 2Z"></path><path d="M10.5 19.5a1.5 1.5 0 0 0 3 0"></path></svg> }
        @case ('plus') { <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg> }
        @case ('user-circle') { <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9"></circle><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path><path d="M7 18a5.5 5.5 0 0 1 10 0"></path></svg> }
        @case ('user') { <svg viewBox="0 0 24 24" fill="none"><path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path><path d="M5.5 19a6.5 6.5 0 0 1 13 0"></path></svg> }
        @case ('shield') { <svg viewBox="0 0 24 24" fill="none"><path d="M12 3 6 5.5v5.8c0 4.4 2.4 7.7 6 9.7 3.6-2 6-5.3 6-9.7V5.5L12 3Z"></path></svg> }
        @case ('key') { <svg viewBox="0 0 24 24" fill="none"><circle cx="8" cy="15" r="3"></circle><path d="m10.5 13.5 8-8"></path><path d="M16 6h2v2"></path><path d="M18 4h2v2"></path></svg> }
        @case ('lock') { <svg viewBox="0 0 24 24" fill="none"><rect x="6" y="11" width="12" height="9" rx="2"></rect><path d="M8.5 11V8a3.5 3.5 0 1 1 7 0v3"></path></svg> }
        @case ('logout') { <svg viewBox="0 0 24 24" fill="none"><path d="M9 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"></path><path d="m13 8 5 4-5 4"></path><path d="M18 12H9"></path></svg> }
        @case ('search') { <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg> }
        @case ('copy') { <svg viewBox="0 0 24 24" fill="none"><rect x="9" y="7" width="10" height="12" rx="2"></rect><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"></path></svg> }
        @case ('external') { <svg viewBox="0 0 24 24" fill="none"><path d="M14 5h5v5"></path><path d="m19 5-8 8"></path><path d="M10 7H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3"></path></svg> }
        @case ('qr') { <svg viewBox="0 0 24 24" fill="none"><path d="M4 4h6v6H4z"></path><path d="M14 4h6v6h-6z"></path><path d="M4 14h6v6H4z"></path><path d="M16 14h1"></path><path d="M14 17h2"></path><path d="M18 18h2"></path><path d="M18 14v2"></path><path d="M20 16v4"></path></svg> }
        @case ('edit') { <svg viewBox="0 0 24 24" fill="none"><path d="m4 20 4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9L4 20Z"></path><path d="m13.5 7.5 3 3"></path></svg> }
        @case ('delete') { <svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14"></path><path d="M9 7V5h6v2"></path><path d="M7 7v12h10V7"></path><path d="M10 11v5"></path><path d="M14 11v5"></path></svg> }
        @case ('link') { <svg viewBox="0 0 24 24" fill="none"><path d="M10 14 8 16a3 3 0 1 1-4-4l2-2"></path><path d="M14 10 16 8a3 3 0 1 1 4 4l-2 2"></path><path d="m9 15 6-6"></path></svg> }
        @case ('download') { <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v10"></path><path d="m8 10 4 4 4-4"></path><path d="M5 19h14"></path></svg> }
        @case ('approved') { <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8"></circle><path d="m8.5 12 2.2 2.2 4.8-4.9"></path></svg> }
        @default { <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8"></circle></svg> }
      }
    </span>
  `,
  styles: [
    `
      :host { display: inline-flex; line-height: 0; }
      .icon-host { display: inline-flex; align-items: center; justify-content: center; }
      svg {
        width: 100%;
        height: 100%;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `
  ]
})
export class AppIconComponent {
  readonly name = input.required<string>();
  readonly size = input(20);
}
