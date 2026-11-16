import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { ApiService, Consumo, Recibo } from '../../services/api.service';
import { UiFeedbackService } from '../../services/ui-feedback.service';
import { CanComponentDeactivate } from '../../guards/pending-changes.guard';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
  standalone: false
})
export class ResultadosPage implements OnInit, ViewWillEnter, CanComponentDeactivate {
  reciboId?: number;
  recibo?: Recibo;
  consumos: Consumo[] = [];
  loading: boolean = true;
  saving: boolean = false;
  error: string = '';

  showEditModal: boolean = false;
  editKwConsumidos: string = '';
  editPrecioEnergiaConsumida: string = '';
  editPrecioAseo: string = '';
  editLecturas: Record<number, string> = {};

  private bypassExitConfirm: boolean = false;

  get precioKW(): number {
    return Number(this.recibo?.precioKw || 0);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private uiFeedback: UiFeedbackService
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
    this.showEditModal = false;
    this.bypassExitConfirm = false;
    this.cdr.markForCheck();
    const queryId = this.route.snapshot.queryParamMap.get('reciboId');
    if (queryId) {
      this.reciboId = Number(queryId);
      this.fetchData();
    } else if (!this.reciboId) {
      this.error = 'No se proporcionó un ID de recibo.';
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.bypassExitConfirm && this.reciboId) {
      $event.returnValue = true;
    }
  }

  async canDeactivate(): Promise<boolean> {
    if (this.bypassExitConfirm) {
      return true;
    }
    return await this.uiFeedback.showConfirm(
      '¿Desea salir?',
      '¿Está seguro que desea dejar la página de resultados?',
      'Salir',
      'Cancelar'
    );
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
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error(err);
            this.error = 'Error al consultar consumos.';
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al obtener el recibo.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  async handleLeaveClick() {
    const confirmed = await this.uiFeedback.showConfirm(
      '¿Desea salir?',
      '¿Está seguro que desea dejar la página de resultados?',
      'Salir',
      'Cancelar'
    );
    if (confirmed) {
      this.bypassExitConfirm = true;
      this.router.navigate(['/calcular-consumo']);
    }
  }

  openEditModal() {
    if (!this.recibo) return;
    this.editKwConsumidos = String(this.recibo.kwConsumidos || '');
    this.editPrecioEnergiaConsumida = String(this.recibo.precioEnergiaConsumida || '');
    this.editPrecioAseo = String(this.recibo.precioAseo || '');

    const initial: Record<number, string> = {};
    this.consumos.forEach((c) => {
      if (c.idRol === 2) {
        initial[c.Apartamento_idApartamento] = String(c.kw || '');
      }
    });
    this.editLecturas = initial;
    this.showEditModal = true;
  }

  closeEditModal() {
    if (this.saving) return;
    this.showEditModal = false;
  }

  private esNumeroPositivo(value: string | number | null | undefined): boolean {
    const num = Number(value);
    return Number.isFinite(num) && num > 0;
  }

  async saveEditConsumo() {
    if (this.saving) return;

    const generalesValidos = [
      this.editKwConsumidos,
      this.editPrecioEnergiaConsumida,
      this.editPrecioAseo
    ].every((value) => this.esNumeroPositivo(value));

    if (!generalesValidos) {
      await this.uiFeedback.showAlert('Datos incompletos', 'Ingresa valores numéricos mayores a 0 en KW y precios.');
      return;
    }

    const tenantConsumos = this.consumos.filter((c) => c.idRol === 2);
    if (tenantConsumos.length === 0) {
      await this.uiFeedback.showAlert(
        'Sin apartamentos ocupados',
        'No hay consumos de inquilinos para editar en este recibo.'
      );
      return;
    }

    const allTenantsHaveReading = tenantConsumos.every((c) =>
      this.esNumeroPositivo(this.editLecturas[c.Apartamento_idApartamento])
    );

    if (!allTenantsHaveReading) {
      await this.uiFeedback.showAlert('Lecturas incompletas', 'Ingresa las lecturas de todos los apartamentos.');
      return;
    }

    // El back espera el arreglo en el orden de los apartamentos (idApartamento ASC).
    const numeroContador = this.consumos
      .slice()
      .sort((a, b) => a.Apartamento_idApartamento - b.Apartamento_idApartamento)
      .map((c) =>
        c.idRol === 2 ? Number(this.editLecturas[c.Apartamento_idApartamento]) : 0
      );

    this.saving = true;
    this.cdr.markForCheck();

    this.apiService
      .editarConsumo(this.recibo!.idRecibo!, {
        kwConsumidos: Number(this.editKwConsumidos),
        precioEnergiaConsumida: Number(this.editPrecioEnergiaConsumida),
        precioAseo: Number(this.editPrecioAseo),
        lecturas: this.editLecturas,
        numeroContador
      })
      .subscribe({
        next: async () => {
          this.saving = false;
          this.showEditModal = false;
          this.fetchData();
          this.cdr.markForCheck();
          await this.uiFeedback.showToast('Valores actualizados correctamente', 'success');
        },
        error: async (err) => {
          this.saving = false;
          this.cdr.markForCheck();
          console.error(err);
          await this.uiFeedback.showAlert('Error', err.error?.error || 'Error al actualizar el consumo');
        }
      });
  }
}
