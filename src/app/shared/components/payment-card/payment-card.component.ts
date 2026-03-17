import { Component, input } from '@angular/core';

import { Scheme } from '../../../core/models/merchant.models';

@Component({
  selector: 'app-payment-card',
  standalone: true,
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.scss'
})
export class PaymentCardComponent {
  readonly scheme = input.required<Scheme>();
}
