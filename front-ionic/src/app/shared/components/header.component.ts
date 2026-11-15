import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  template: `
    <header class="app-header">
      <div class="header-content">
        <button *ngIf="showBack" class="back-btn" (click)="goBack()" aria-label="Volver">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
               stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      width: 100%;
      height: 72px;
      background: linear-gradient(135deg, #171B34 0%, #22253F 50%, #1E1A3A 100%);
      display: flex;
      align-items: center;
      padding: 0 32px;
      border-bottom: 1px solid rgba(255, 77, 103, 0.12);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-content {
      display: flex;
      align-items: center;
    }
    .back-btn {
      background: rgba(255, 77, 103, 0.1);
      border: none;
      outline: none;
      border-radius: 8px;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 6px;
      transition: all 0.3s ease;
      opacity: 1;
      color: #ffffff;
    }
    .back-btn:hover {
      transform: scale(1.05);
      background: rgba(255, 77, 103, 0.25);
      opacity: 1;
    }
    .back-btn svg {
      display: block;
    }
  `],
  standalone: false
})
export class HeaderComponent {
  @Input() showBack: boolean = false;
  @Input() backRoute?: string;

  constructor(private router: Router) {}

  goBack() {
    if (this.backRoute) {
      this.router.navigateByUrl(this.backRoute);
    } else {
      window.history.back();
    }
  }
}
