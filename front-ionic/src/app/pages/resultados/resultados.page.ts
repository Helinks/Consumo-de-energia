import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, Consumo, Recibo } from '../../services/api.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
  standalone: false
})
export class ResultadosPage implements OnInit {
  reciboId?: number;
  recibo?: Recibo;
  consumos: Consumo[] = [];
  loading: boolean = true;
  error: string = '';

  showEditModal: boolean = false;
  editKwConsumidos: string = '';
  editPrecioEnergiaConsumida: string = '';
  editPrecioAseo: string = '';
  editLecturas: Record<number, string> = {};

  get precioKW(): number {
    return Number(this.recibo?.precioKw || 0);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.reciboId = params['reciboId'] ? Number(params['reciboId']) : undefined;
      if (!this.reciboId) {
        this.error = 'No se proporcionó un ID de recibo.';
        this.loading = false;
        this.cdr.markForCheck();
        return;
      }
      this.fetchData();
    });
  }

  fetchData() {
    if (!this.reciboId) return;
    this.loading = true;

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

  handleLeaveClick() {
    if (confirm('¿Está seguro que desea salir de la página de resultados?')) {
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
    this.showEditModal = false;
  }

  saveEditConsumo() {
    if (!this.editKwConsumidos || !this.editPrecioEnergiaConsumida || !this.editPrecioAseo) {
      alert('Completa todos los campos.');
      return;
    }

    const tenantConsumos = this.consumos.filter((c) => c.idRol === 2);
    const allTenantsHaveReading = tenantConsumos.every((c) => {
      const val = Number(this.editLecturas[c.Apartamento_idApartamento]);
      return !isNaN(val) && val > 0;
    });

    if (!allTenantsHaveReading) {
      alert('Ingresa las lecturas de todos los apartamentos.');
      return;
    }

    // El back espera el arreglo en el orden de los apartamentos (idApartamento ASC).
    const numeroContador = this.consumos
      .slice()
      .sort((a, b) => a.Apartamento_idApartamento - b.Apartamento_idApartamento)
      .map((c) =>
        c.idRol === 2 ? Number(this.editLecturas[c.Apartamento_idApartamento]) : 0
      );

    this.apiService
      .editarConsumo(this.recibo!.idRecibo!, {
        kwConsumidos: Number(this.editKwConsumidos),
        precioEnergiaConsumida: Number(this.editPrecioEnergiaConsumida),
        precioAseo: Number(this.editPrecioAseo),
        lecturas: this.editLecturas,
        numeroContador
      })
      .subscribe({
        next: () => {
          this.closeEditModal();
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
