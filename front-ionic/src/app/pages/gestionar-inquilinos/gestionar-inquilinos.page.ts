import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { ApiService, Apartamento, Responsable } from '../../services/api.service';
import { UiFeedbackService } from '../../services/ui-feedback.service';

@Component({
  selector: 'app-gestionar-inquilinos',
  templateUrl: './gestionar-inquilinos.page.html',
  styleUrls: ['./gestionar-inquilinos.page.scss'],
  standalone: false
})
export class GestionarInquilinosPage implements OnInit, ViewWillEnter {
  inquilinos: Responsable[] = [];
  apartamentos: Apartamento[] = [];

  showAdd: boolean = false;
  showEdit: boolean = false;
  showDetails: boolean = false;
  saving: boolean = false;

  selectedInquilino: Responsable | null = null;

  addNombres: string = '';
  editNombres: string = '';
  editIdEstado: string = '1';

  get activos(): Responsable[] {
    return this.inquilinos.filter((i) => i.Estado_idEstado === 1);
  }

  get inactivos(): Responsable[] {
    return this.inquilinos.filter((i) => i.Estado_idEstado !== 1);
  }

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private uiFeedback: UiFeedbackService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.showAdd = false;
    this.showEdit = false;
    this.showDetails = false;
    this.cdr.markForCheck();
    this.fetchInquilinos();
  }

  fetchInquilinos() {
    forkJoin({
      resInq: this.apiService.getResponsables(),
      resApt: this.apiService.getApartamentos()
    }).subscribe({
      next: ({ resInq, resApt }) => {
        if (Array.isArray(resInq.message)) {
          // Esta pantalla administra solo inquilinos. El dueño (rol 1)
          // no debe poder editarse ni eliminarse desde aquí.
          this.inquilinos = resInq.message.filter((i) => i.idRol !== 1);
        } else {
          this.inquilinos = [];
        }
        this.apartamentos = Array.isArray(resApt.message) ? resApt.message : [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar inquilinos:', err);
        this.cdr.markForCheck();
      }
    });
  }

  openAddModal() {
    this.addNombres = '';
    this.showAdd = true;
  }

  async handleAddSave() {
    if (this.saving) return;

    if (!this.addNombres.trim()) {
      await this.uiFeedback.showAlert('Dato requerido', 'Ingresa un nombre para el inquilino.');
      return;
    }

    this.saving = true;
    this.cdr.markForCheck();

    this.apiService.crearResponsable({ nombres: this.addNombres.trim() }).subscribe({
      next: async () => {
        this.saving = false;
        this.showAdd = false;
        this.fetchInquilinos();
        this.cdr.markForCheck();
        await this.uiFeedback.showToast('Inquilino agregado exitosamente', 'success');
      },
      error: async (err) => {
        this.saving = false;
        this.cdr.markForCheck();
        console.error(err);
        await this.uiFeedback.showAlert('Error', err.error?.error || 'Error al guardar el inquilino');
      }
    });
  }

  openEditModal(inquilino: Responsable) {
    this.selectedInquilino = inquilino;
    this.editNombres = inquilino.nombres || '';
    this.editIdEstado = String(inquilino.Estado_idEstado || '1');
    this.showEdit = true;
  }

  async handleEditSave() {
    if (this.saving) return;

    if (!this.editNombres.trim() || !this.selectedInquilino?.idResponsable) {
      await this.uiFeedback.showAlert('Dato requerido', 'Ingresa un nombre.');
      return;
    }

    const nuevoEstado = Number(this.editIdEstado);
    if (nuevoEstado !== 1) {
      const aptAsignado = this.apartamentos.find(
        (a) => a.Responsable_idResponsable === this.selectedInquilino?.idResponsable
      );
      if (aptAsignado) {
        await this.uiFeedback.showAlert(
          'Inquilino asignado',
          `No puedes desactivar a este inquilino porque está asignado a "${aptAsignado.descripcion}". Primero desvincula el apartamento.`
        );
        return;
      }
    }

    this.saving = true;
    this.cdr.markForCheck();

    this.apiService
      .editarResponsable({
        id: this.selectedInquilino.idResponsable,
        nombres: this.editNombres.trim(),
        idEstado: nuevoEstado
      })
      .subscribe({
        next: async () => {
          this.saving = false;
          this.showEdit = false;
          this.selectedInquilino = null;
          this.fetchInquilinos();
          this.cdr.markForCheck();
          await this.uiFeedback.showToast('Inquilino actualizado exitosamente', 'success');
        },
        error: async (err) => {
          this.saving = false;
          this.cdr.markForCheck();
          console.error(err);
          await this.uiFeedback.showAlert('Error', err.error?.error || 'Error al actualizar');
        }
      });
  }

  openDetailsModal(inquilino: Responsable) {
    this.selectedInquilino = inquilino;
    this.showDetails = true;
  }

  async handleDelete(id: number) {
    if (this.saving) return;

    const aptAsignado = this.apartamentos.find((a) => a.Responsable_idResponsable === id);
    if (aptAsignado) {
      await this.uiFeedback.showAlert(
        'Inquilino asignado',
        `No puedes eliminar a este inquilino porque está asignado a "${aptAsignado.descripcion}". Primero desvincula el apartamento.`
      );
      return;
    }

    const confirmed = await this.uiFeedback.showConfirm(
      '¿Eliminar inquilino?',
      '¿Está seguro que desea eliminar a este inquilino? Esta acción no se puede deshacer.',
      'Eliminar',
      'Cancelar'
    );
    if (!confirmed) return;

    this.saving = true;
    this.cdr.markForCheck();

    this.apiService.borrarResponsable(id).subscribe({
      next: async () => {
        this.saving = false;
        this.showDetails = false;
        this.selectedInquilino = null;
        this.fetchInquilinos();
        this.cdr.markForCheck();
        await this.uiFeedback.showToast('Inquilino eliminado', 'success');
      },
      error: async (err) => {
        this.saving = false;
        this.cdr.markForCheck();
        console.error(err);
        await this.uiFeedback.showAlert('Error', err.error?.error || 'Error al eliminar');
      }
    });
  }
}

