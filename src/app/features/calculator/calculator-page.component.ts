import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-calculator-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './calculator-page.component.html',
  styleUrl: './calculator-page.component.scss'
})
export class CalculatorPageComponent {
  private readonly fb = inject(FormBuilder);

  readonly rates: Record<string, number> = {
    Payout: 1.2,
    'Payment Gateway': 1.85,
    'Wallet Transfer': 0.75
  };

  readonly form = this.fb.nonNullable.group({
    type: ['Payout', Validators.required],
    amount: ['', Validators.required]
  });

  readonly result = signal<{ commission: string; gst: string; settlement: string } | null>(null);
  readonly selectedRate = computed(() => this.rates[this.form.controls.type.value] ?? 0);

  calculate(): void {
    const amount = Number(this.form.controls.amount.value);

    if (!Number.isFinite(amount) || amount <= 0) {
      this.result.set(null);
      return;
    }

    const commission = amount * (this.selectedRate() / 100);
    const gst = commission * 0.18;
    const settlement = amount - commission - gst;

    this.result.set({
      commission: `₹${commission.toFixed(2)}`,
      gst: `₹${gst.toFixed(2)}`,
      settlement: `₹${settlement.toFixed(2)}`
    });
  }
}
