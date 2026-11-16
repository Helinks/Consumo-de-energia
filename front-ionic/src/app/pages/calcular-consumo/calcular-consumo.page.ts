import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { ApiService, Apartamento } from '../../services/api.service';
import { UiFeedbackService } from '../../services/ui-feedback.service';

@Component({
  selector: 'app-calcular-consumo',
  templateUrl: './calcular-consumo.page.html',
  styleUrls: ['./calcular-consumo.page.scss'],
  standalone: false
})
export class CalcularConsumoPage implements OnInit, ViewWillEnter {
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
    private cdr: ChangeDetectorRef,
    private uiFeedback: UiFeedbackService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.kwConsumidos = '';
    this.precioEnergiaConsumida = '';
    this.precioAseo = '';
    this.cdr.markForCheck();
    this.fetchApartments();
  }

  fetchApartments() {
    this.loading = true;
    this.cdr.markForCheck();
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

  private esNumeroPositivo(value: string | number | null | undefined): boolean {
    const num = Number(value);
    return Number.isFinite(num) && num > 0;
  }

  async handleCalculate() {
    if (this.submitting) return;

    const generalesValidos = [
      this.kwConsumidos,
      this.precioEnergiaConsumida,
      this.precioAseo
    ].every((value) => this.esNumeroPositivo(value));

    if (!generalesValidos) {
      await this.uiFeedback.showAlert('Datos incompletos', 'Ingresa valores numéricos mayores a 0 en KW y precios.');
      return;
    }

    const tenantApartments = this.apartments.filter((apt) => apt.idRol === 2);
    if (tenantApartments.length === 0) {
      await this.uiFeedback.showAlert(
        'Sin apartamentos ocupados',
        'No hay apartamentos con inquilinos asignados para calcular el consumo.'
      );
      return;
    }

    const allTenantsHaveReading = tenantApartments.every((apt) =>
      this.esNumeroPositivo(this.contadores[apt.idApartamento])
    );

    if (!allTenantsHaveReading) {
      await this.uiFeedback.showAlert('Lecturas pendientes', 'Ingresa las lecturas de todos los apartamentos.');
      return;
    }

    const numeroContador = this.apartments
      .slice()
      .sort((a, b) => a.idApartamento - b.idApartamento)
      .map((apt) => Number(this.contadores[apt.idApartamento] || 0));

    this.submitting = true;
    this.cdr.markForCheck();

    this.apiService
      .crearRecibo({
        kwConsumidos: Number(this.kwConsumidos),
        precioEnergiaConsumida: Number(this.precioEnergiaConsumida),
        precioAseo: Number(this.precioAseo),
        lecturas: this.contadores,
        numeroContador
      })
      .subscribe({
        next: async (result) => {
          this.submitting = false;
          this.kwConsumidos = '';
          this.precioEnergiaConsumida = '';
          this.precioAseo = '';
          this.cdr.markForCheck();
          await this.uiFeedback.showToast('Cálculo registrado exitosamente', 'success');
          this.router.navigate(['/resultados'], {
            queryParams: { reciboId: result.reciboId }
          });
        },
        error: async (err) => {
          this.submitting = false;
          this.cdr.markForCheck();
          console.error(err);
          await this.uiFeedback.showAlert('Error al calcular', err.error?.error || 'Ocurrió un error al procesar el cálculo.');
        }
      });
  }
}
