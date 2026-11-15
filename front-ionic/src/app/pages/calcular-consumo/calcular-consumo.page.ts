import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, Apartamento } from '../../services/api.service';

@Component({
  selector: 'app-calcular-consumo',
  templateUrl: './calcular-consumo.page.html',
  styleUrls: ['./calcular-consumo.page.scss'],
  standalone: false
})
export class CalcularConsumoPage implements OnInit {
  apartments: Apartamento[] = [];
  loading: boolean = true;
  submitting: boolean = false;

  kwConsumidos: string = '';
  precioEnergiaConsumida: string = '';
  precioAseo: string = '';

  contadores: Record<number, string> = {};

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchApartments();
  }

  fetchApartments() {
    this.loading = true;
    this.apiService.getApartamentosCalcular().subscribe({
      next: (data) => {
        if (Array.isArray(data.message)) {
          this.apartments = data.message;
          const initial: Record<number, string> = {};
          data.message.forEach((apt) => {
            initial[apt.idApartamento] = '';
          });
          this.contadores = initial;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar apartamentos:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  handleCalculate() {
    if (!this.kwConsumidos || !this.precioEnergiaConsumida || !this.precioAseo) {
      alert('Completa todos los campos.');
      return;
    }

    const tenantApartments = this.apartments.filter((apt) => apt.idRol === 2);
    const allTenantsHaveReading = tenantApartments.every((apt) => {
      const val = Number(this.contadores[apt.idApartamento]);
      return !isNaN(val) && val > 0;
    });

    if (!allTenantsHaveReading) {
      alert('Ingresa las lecturas de todos los apartamentos.');
      return;
    }

    const numeroContador = this.apartments.map((apt) =>
      Number(this.contadores[apt.idApartamento] || 0)
    );

    this.submitting = true;

    this.apiService
      .crearRecibo({
        kwConsumidos: Number(this.kwConsumidos),
        precioEnergiaConsumida: Number(this.precioEnergiaConsumida),
        precioAseo: Number(this.precioAseo),
        lecturas: this.contadores,
        numeroContador
      })
      .subscribe({
        next: (result) => {
          this.submitting = false;
          this.cdr.markForCheck();
          this.router.navigate(['/resultados'], {
            queryParams: { reciboId: result.reciboId }
          });
        },
        error: (err) => {
          this.submitting = false;
          this.cdr.markForCheck();
          console.error(err);
          alert(err.error?.error || 'Error al calcular.');
        }
      });
  }
}
