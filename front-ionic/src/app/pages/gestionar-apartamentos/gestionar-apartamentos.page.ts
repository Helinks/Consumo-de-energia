import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService, Apartamento, Responsable } from '../../services/api.service';

@Component({
  selector: 'app-gestionar-apartamentos',
  templateUrl: './gestionar-apartamentos.page.html',
  styleUrls: ['./gestionar-apartamentos.page.scss'],
  standalone: false
})
export class GestionarApartamentosPage implements OnInit {
  apartamentos: Apartamento[] = [];
  inquilinos: Responsable[] = [];

  showAdd: boolean = false;
  showDetalles: boolean = false;
  selectedApartamento: Apartamento | null = null;

  addDescripcion: string = '';
  addIdResponsable: string = '';

  editDescripcion: string = '';
  editIdResponsable: string = '';

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.apiService.getApartamentos().subscribe({
      next: (resApts) => {
        // Se excluye el apartamento del propietario (idRol = 1) del listado de gestión.
        this.apartamentos = (resApts.message || []).filter((apt) => apt.idRol !== 1);
        this.cdr.markForCheck();
        this.apiService.getResponsables().subscribe({
          next: (resInq) => {
            this.inquilinos = resInq.message || [];
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error(err);
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.cdr.markForCheck();
      }
    });
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

  handleAddSave() {
    if (!this.addDescripcion.trim()) {
      alert('Ingresa una descripción.');
      return;
    }
    if (!this.addIdResponsable) {
      alert('Selecciona un responsable.');
      return;
    }

    this.apiService
      .crearApartamento({
        descripcion: this.addDescripcion,
        idResponsable: Number(this.addIdResponsable)
      })
      .subscribe({
        next: () => {
          this.showAdd = false;
          this.fetchData();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.cdr.markForCheck();
          alert(err.error?.error || 'Error al guardar');
        }
      });
  }

  openDetallesModal(apt: Apartamento) {
    this.selectedApartamento = apt;
    this.editDescripcion = apt.descripcion || '';
    this.editIdResponsable = String(apt.Responsable_idResponsable || '');
    this.showDetalles = true;
  }

  handleUpdateSave() {
    if (!this.editDescripcion.trim() || !this.selectedApartamento) {
      alert('La descripción es obligatoria.');
      return;
    }

    this.apiService
      .editarApartamento({
        id: this.selectedApartamento.idApartamento,
        descripcion: this.editDescripcion,
        idResponsable: Number(this.editIdResponsable || 0)
      })
      .subscribe({
        next: () => {
          this.showDetalles = false;
          this.selectedApartamento = null;
          this.fetchData();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.cdr.markForCheck();
          alert(err.error?.error || 'Error al actualizar');
        }
      });
  }
}
