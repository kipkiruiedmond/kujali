import { Component, inject, signal, computed, effect } from '@angular/core';
import { BudgetTableComponent } from '../budget-table/budget-table.component';
import { BudgetService } from '../services/budget.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-select-budget-page',
  standalone: true,
  imports: [BudgetTableComponent],
  template: `
    <div class="budget-page">
      <h1>Budget Management</h1>
      
      @if (isLoading()) {
        <div class="loading-state">Loading your budgets...</div>
      } @else {
        <div class="budget-stats">
          <p>Total Budgets: {{ totalBudgets() }}</p>
          <p>Active Budgets: {{ activeBudgets() }}</p>
        </div>
        
        <app-budget-table 
          [budgets]="allBudgets()"
          [isLoading]="isLoading()"
        />
      }
    </div>
  `,
  styles: [`
    .budget-page { padding: 20px; }
    .loading-state { 
      text-align: center; 
      padding: 40px; 
      font-style: italic; 
      color: #666; 
    }
    .budget-stats { 
      margin-bottom: 20px; 
      padding: 15px; 
      background: #f5f5f5; 
      border-radius: 8px; 
    }
  `]
})
export class SelectBudgetPageComponent {
  private budgetService = inject(BudgetService);

  private overviewRaw = toSignal(this.budgetService.getOverview(), { initialValue: [] });
  private sharedBudgetsRaw = toSignal(this.budgetService.getSharedBudgets(), { initialValue: [] });

  isLoading = signal(true);

  allBudgets = computed(() => {
    const overview = this.overviewRaw();
    const shared = this.sharedBudgetsRaw();
    return [...overview, ...shared];
  });

  totalBudgets = computed(() => this.allBudgets().length);

  activeBudgets = computed(() => 
    this.allBudgets().filter(budget => budget.status === 'active').length
  );

  constructor() {
    effect(() => {
      const budgets = this.allBudgets();
      
      if (budgets.length > 0) {
        this.isLoading.set(false);
        
        console.log(`[Analytics] User loaded ${budgets.length} budgets`);
      }
    });

  }
}