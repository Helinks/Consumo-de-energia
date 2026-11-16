import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { ApiService, Consumo, Recibo } from '../../services/api.service';

@Component({
  selector: 'app-resultado-historial',
  templateUrl: './resultado-historial.page.html',
  styleUrls: ['./resultado-historial.page.scss'],
  standalone: false
})
export class ResultadoHistorialPage implements OnInit, ViewWillEnter {
  reciboId?: number;
  recibo?: Recibo;
  consumos: Consumo[] = [];
  loading: boolean = true;
  error: string = '';
  totales: { totalConsumo: number; totalAseo: number; totalFinal: number } | null = null;

  get precioKW(): number {
    return Number(this.recibo?.precioKw || 0);
  }

  get totalConsumo(): number {
    return (
      this.totales?.totalConsumo ??
      this.consumos.reduce((sum, c) => sum + Number(c.precioConsumo || 0), 0)
    );
  }

  get totalAseo(): number {
    return (
      this.totales?.totalAseo ??
      this.consumos.reduce((sum, c) => sum + Number(c.precioAseo || 0), 0)
    );
  }

  get totalFinal(): number {
    return (
      this.totales?.totalFinal ??
      this.consumos.reduce((sum, c) => sum + Number(c.precioConsumoFinal || 0), 0)
    );
  }

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const id = params['reciboId'] ? Number(params['reciboId']) : undefined;
      if (id && id !== this.reciboId) {
        this.reciboId = id;
        this.fetchData();
      }
    });
  }

  ionViewWillEnter() {
    const queryId = this.route.snapshot.queryParamMap.get('reciboId');
    if (queryId) {
      this.reciboId = Number(queryId);
      this.fetchData();
    } else if (!this.reciboId) {
      this.error = 'No se ha proporcionado un ID de recibo.';
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  fetchData() {
    if (!this.reciboId) return;
    this.loading = true;
    this.error = '';
    this.cdr.markForCheck();

    this.apiService.getReciboPorId(this.reciboId).subscribe({
      next: (resRecibo) => {
        this.recibo = resRecibo.message;
        this.apiService.getConsumosDeRecibo(this.reciboId!).subscribe({
          next: (resConsumos) => {
            this.consumos = resConsumos.message || [];
            if (resConsumos.totales) {
              this.totales = resConsumos.totales;
            }
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error al cargar consumos:', err);
            this.error = 'Error de conexión con el servidor.';
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar recibo:', err);
        this.error = 'Error al obtener el recibo.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
