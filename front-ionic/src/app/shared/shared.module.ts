import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { HeaderComponent } from './components/header.component';
import { FormatNumberPipe } from './format-number.pipe';

@NgModule({
  declarations: [HeaderComponent, FormatNumberPipe],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [HeaderComponent, FormatNumberPipe, CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class SharedModule {}
