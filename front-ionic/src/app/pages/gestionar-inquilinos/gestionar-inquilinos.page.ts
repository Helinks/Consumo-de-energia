import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService, Responsable } from '../../services/api.service';

@Component({
  selector: 'app-gestionar-inquilinos',
  templateUrl: './gestionar-inquilinos.page.html',
  styleUrls: ['./gestionar-inquilinos.page.scss'],
  standalone: false
})
export class GestionarInquilinosPage implements OnInit {
  inquilinos: Responsable[] = [];

  showAdd: boolean = false;
  showEdit: boolean = false;
  showDetails: boolean = false;

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

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchInquilinos();
  }

  fetchInquilinos() {
    this.apiService.getResponsables().subscribe({
      next: (res) => {
        if (Array.isArray(res.message)) {
          this.inquilinos = res.message;
        } else {
          this.inquilinos = [];
        }
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

  handleAddSave() {
    if (!this.addNombres.trim()) {
      alert('Ingresa un nombre.');
      return;
    }

    this.apiService.crearResponsable({ nombres: this.addNombres }).subscribe({
      next: () => {
        this.showAdd = false;
        this.fetchInquilinos();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.cdr.markForCheck();
        alert(err.error?.error || 'Error al guardar');
      }
    });
  }

  openEditModal(inquilino: Responsable) {
    this.selectedInquilino = inquilino;
    this.editNombres = inquilino.nombres || '';
    this.editIdEstado = String(inquilino.Estado_idEstado || '1');
    this.showEdit = true;
  }

  handleEditSave() {
    if (!this.editNombres.trim() || !this.selectedInquilino?.idResponsable) {
      alert('Ingresa un nombre.');
      return;
    }

    this.apiService
      .editarResponsable({
        id: this.selectedInquilino.idResponsable,
        nombres: this.editNombres,
        idEstado: Number(this.editIdEstado)
      })
      .subscribe({
        next: () => {
          this.showEdit = false;
          this.selectedInquilino = null;
          this.fetchInquilinos();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.cdr.markForCheck();
          alert(err.error?.error || 'Error al actualizar');
        }
      });
  }

  openDetailsModal(inquilino: Responsable) {
    this.selectedInquilino = inquilino;
    this.showDetails = true;
  }

  handleDelete(id: number) {
    if (!confirm('¿Eliminar este inquilino?')) return;

    this.apiService.borrarResponsable(id).subscribe({
      next: () => {
        this.showDetails = false;
        this.selectedInquilino = null;
        this.fetchInquilinos();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.cdr.markForCheck();
        alert(err.error?.error || 'Error al eliminar');
      }
    });
  }
}
