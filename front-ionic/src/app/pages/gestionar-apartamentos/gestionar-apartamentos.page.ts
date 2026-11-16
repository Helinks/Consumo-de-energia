import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { ApiService, Apartamento, Responsable } from '../../services/api.service';
import { UiFeedbackService } from '../../services/ui-feedback.service';

@Component({
  selector: 'app-gestionar-apartamentos',
  templateUrl: './gestionar-apartamentos.page.html',
  styleUrls: ['./gestionar-apartamentos.page.scss'],
  standalone: false
})
export class GestionarApartamentosPage implements OnInit, ViewWillEnter {
  apartamentos: Apartamento[] = [];
  inquilinos: Responsable[] = [];

  showAdd: boolean = false;
  showDetalles: boolean = false;
  saving: boolean = false;
  selectedApartamento: Apartamento | null = null;

  addDescripcion: string = '';
  addIdResponsable: string = '';

  editDescripcion: string = '';
  editIdResponsable: string = '';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private uiFeedback: UiFeedbackService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.showAdd = false;
    this.showDetalles = false;
    this.cdr.markForCheck();
    this.fetchData();
  }

  fetchData() {
    forkJoin({
      apts: this.apiService.getApartamentos(),
      inqs: this.apiService.getResponsables()
    }).subscribe({
      next: ({ apts, inqs }) => {
        // Se excluye el apartamento del propietario (idRol = 1) del listado de gestión.
        this.apartamentos = (apts.message || []).filter((apt) => apt.idRol !== 1);
        // Solo se pueden asignar inquilinos (rol 2). El dueño (rol 1) se excluye.
        this.inquilinos = (inqs.message || []).filter((r) => r.idRol === 2);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.cdr.markForCheck();
      }
    });
  }

  get inquilinosActivos(): Responsable[] {
    return this.inquilinos.filter((r) => r.Estado_idEstado === 1);
  }

  get inquilinosParaEditar(): Responsable[] {
    const currentId = this.selectedApartamento?.Responsable_idResponsable;
    return this.inquilinos.filter(
      (r) => r.Estado_idEstado === 1 || (currentId && r.idResponsable === currentId)
    );
  }

  getResponsableName(idResponsable?: number): string {
    if (!idResponsable || idResponsable <= 0) return 'Libre';
    const found = this.inquilinos.find((i) => i.idResponsable === idResponsable);
    return found ? found.nombres : 'Libre';
  }

  openAddModal() {
    this.addDescripcion = '';
    this.addIdResponsable = '';
    this.showAdd = true;
  }

  async handleAddSave() {
    if (this.saving) return;

    if (!this.addDescripcion.trim()) {
      await this.uiFeedback.showAlert('Dato requerido', 'Ingresa una descripción para el apartamento.');
      return;
    }
    const resp = this.inquilinos.find((r) => r.idResponsable === Number(this.addIdResponsable));
    if (resp && resp.Estado_idEstado !== 1) {
      await this.uiFeedback.showAlert('Inquilino inactivo', 'No puedes asignar un inquilino inactivo.');
      return;
    }

    this.saving = true;
    this.cdr.markForCheck();

    this.apiService
      .crearApartamento({
        descripcion: this.addDescripcion.trim(),
        idResponsable: Number(this.addIdResponsable || 0)
      })
      .subscribe({
        next: async () => {
          this.saving = false;
          this.showAdd = false;
          this.fetchData();
          this.cdr.markForCheck();
          await this.uiFeedback.showToast('Apartamento creado exitosamente', 'success');
        },
        error: async (err) => {
          this.saving = false;
          this.cdr.markForCheck();
          console.error(err);
          await this.uiFeedback.showAlert('Error', err.error?.error || 'Error al guardar el apartamento');
        }
      });
  }

  openDetallesModal(apt: Apartamento) {
    this.selectedApartamento = apt;
    this.editDescripcion = apt.descripcion || '';
    this.editIdResponsable = String(apt.Responsable_idResponsable || '');
    this.showDetalles = true;
  }

  async handleUpdateSave() {
    if (this.saving) return;

    if (!this.editDescripcion.trim() || !this.selectedApartamento) {
      await this.uiFeedback.showAlert('Dato requerido', 'La descripción es obligatoria.');
      return;
    }

    const selectedId = Number(this.editIdResponsable || 0);
    const resp = this.inquilinos.find((r) => r.idResponsable === selectedId);
    const currentId = this.selectedApartamento.Responsable_idResponsable;
    // Si se está cambiando a otro inquilino, ese inquilino debe estar activo
    if (resp && resp.Estado_idEstado !== 1 && selectedId !== currentId) {
      await this.uiFeedback.showAlert('Inquilino inactivo', 'No puedes asignar un inquilino inactivo.');
      return;
    }

    this.saving = true;
    this.cdr.markForCheck();

    this.apiService
      .editarApartamento({
        id: this.selectedApartamento.idApartamento,
        descripcion: this.editDescripcion.trim(),
        idResponsable: selectedId
      })
      .subscribe({
        next: async () => {
          this.saving = false;
          this.showDetalles = false;
          this.selectedApartamento = null;
          this.fetchData();
          this.cdr.markForCheck();
          await this.uiFeedback.showToast('Apartamento actualizado', 'success');
        },
        error: async (err) => {
          this.saving = false;
          this.cdr.markForCheck();
          console.error(err);
          await this.uiFeedback.showAlert('Error', err.error?.error || 'Error al actualizar');
        }
      });
  }
}

