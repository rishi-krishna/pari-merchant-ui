import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  templateUrl: './placeholder-page.component.html',
  styleUrl: './placeholder-page.component.css'
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly headline = this.route.snapshot.data['headline'] as string;
  readonly description = this.route.snapshot.data['description'] as string;
}
