import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-address',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-address.component.html',
  styleUrl: './edit-address.component.css'
})
export class EditAddressComponent {
  editAddressForm: FormGroup;
  form = inject(FormBuilder)
  constructor(
    private dialogRef: MatDialogRef<EditAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(this.data)
    this.editAddressForm = this.form.group({
      "calle_principal": [data.calle_principal],
      "calle_secundaria": [data.calle_secundaria],
      "referencia": [data],
      "numero": [data.numero],
      "codigo_postal": [data.codigo_postal],
      "ciudad": [data.ciudad],
      "estado": [data.estado],
      "pais": [data.pais],
      "activo": [data.activo]
    });
  }

  close(){
    this.dialogRef.close();
  }
}
