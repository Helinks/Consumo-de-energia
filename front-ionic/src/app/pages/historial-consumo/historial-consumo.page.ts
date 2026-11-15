import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService, Recibo } from '../../services/api.service';

@Component({
  selector: 'app-historial-consumo',
  templateUrl: './historial-consumo.page.html',
  styleUrls: ['./historial-consumo.page.scss'],
  standalone: false
})
export class HistorialConsumoPage implements OnInit {
  recibos: Recibo[] = [];
  loading: boolean = true;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchRecibos();
  }

  fetchRecibos() {
    this.loading = true;
    this.apiService.getRecibos().subscribe({
      next: (res) => {
        if (Array.isArray(res.message)) {
          this.recibos = res.message;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar historial:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}
