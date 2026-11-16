import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { ApiService, Recibo } from '../../services/api.service';

@Component({
  selector: 'app-historial-consumo',
  templateUrl: './historial-consumo.page.html',
  styleUrls: ['./historial-consumo.page.scss'],
  standalone: false
})
export class HistorialConsumoPage implements OnInit, ViewWillEnter {
  recibos: Recibo[] = [];
  loading: boolean = true;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.fetchRecibos();
  }

  fetchRecibos() {
    this.loading = true;
    this.cdr.markForCheck();
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
