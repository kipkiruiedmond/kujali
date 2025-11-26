import { Component, input, computed } from '@angular/core';

export interface Budget {
  id: string;
  name: string;
  amount: number;
  status: 'active' | 'archived' | 'draft';
  category: string;
  lastModified: Date;
}

@Component({
  selector: 'app-budget-table',
  standalone: true,
  template: `
    <div class="table-container">
      <table class="budget-table">
        <thead>
          <tr>
            <th>Budget Name</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          @for (budget of displayedBudgets(); track budget.id) {
            <tr [class.active]="budget.status === 'active'">
              <td class="budget-name">{{ budget.name }}</td>
              <td class="budget-amount">{{ budget.amount | currency:'USD':'symbol':'1.2-2' }}</td>
              <td>
                <span class="category-tag">{{ budget.category }}</span>
              </td>
              <td>
                <span 
                  class="status-badge" 
                  [class]="'status-' + budget.status"
                >
                  {{ budget.status }}
                </span>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" class="no-data">
                {{ isLoading() ? 'Loading budgets...' : 'No budgets available' }}
              </td>
            </tr>
          }
        </tbody>
      </table>
      
      @if (displayedBudgets().length > 0) {
        <div class="table-footer">
          Showing {{ displayedBudgets().length }} budgets
          @if (hasActiveBudgets()) {
            • {{ activeBudgetsCount() }} active
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .table-container { 
      border: 1px solid #e0e0e0; 
      border-radius: 8px; 
      overflow: hidden; 
    }
    .budget-table { 
      width: 100%; 
      border-collapse: collapse; 
    }
    .budget-table th {
      background: #f8f9fa;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      border-bottom: 1px solid #e0e0e0;
    }
    .budget-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    .budget-table tr:last-child td {
      border-bottom: none;
    }
    .budget-table tr.active {
      background-color: #f8fff8;
    }
    .budget-name { 
      font-weight: 500; 
      color: #2c3e50; 
    }
    .budget-amount { 
      font-family: 'Courier New', monospace; 
      font-weight: 600; 
    }
    .category-tag {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8em;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: 500;
    }
    .status-active {
      background: #e8f5e8;
      color: #2e7d32;
    }
    .status-archived {
      background: #f5f5f5;
      color: #666;
    }
    .status-draft {
      background: #fff3e0;
      color: #ef6c00;
    }
    .no-data {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 40px !important;
    }
    .table-footer {
      padding: 12px 16px;
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
      font-size: 0.9em;
      color: #666;
    }
  `]
})
export class BudgetTableComponent {
  budgets = input.required<Budget[]>();
  isLoading = input<boolean>(false);

  displayedBudgets = computed(() => {
    const budgets = this.budgets();
    return [...budgets].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  });

  hasActiveBudgets = computed(() => 
    this.displayedBudgets().some(budget => budget.status === 'active')
  );

  activeBudgetsCount = computed(() => 
    this.displayedBudgets().filter(budget => budget.status === 'active').length
  );

}