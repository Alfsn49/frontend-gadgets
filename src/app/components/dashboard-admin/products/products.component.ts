import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../core/services/products.service';
import { ToastrService } from 'ngx-toastr';
import { CatalogService } from '../core/services/catalog.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatSortModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  displayedColumns: string[] = ['id', 'name','image','cardCode','stock','price','description','categoria','subCategoria', 'marca','set','actions'];

  dataSource= new MatTableDataSource<any>([]);
      sortedData: any[] = [];
      modalCreate = false;
    modalEditar = false;
    modalEliminar = false;
    modalConfirmarEliminar = false;
 createForm: FormGroup;
 editForm: FormGroup;

  products: any = [];
  idProducts: any = null;

  categories: any = [];
  brands: any = [];
  subCategories: any = [];
  sets: any = [];
  isSetDisabled = true; // ⬅️ Inicialmente deshabilitado

 //Injecciones de servicios
 fb = inject(FormBuilder)
 productsService = inject(ProductsService)
 catalogService = inject(CatalogService)
 toastr = inject(ToastrService)

 imageUrl: string | null = null; // Para almacenar el URL de la imagen
  previewUrl: string | null = null; 
  imageFile: any = null; // Para almacenar temporalmente la imagen seleccionada
  isDragging = false;  
  isSubmitting = false;

 searchText: string = '';
      timeout: any = null;
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;

 constructor(){
  this.createForm = this.fb.group({
    name:['', [Validators.required, Validators.maxLength(100)]],
    image:[''],
    cardCode:['', [Validators.required]],
    stock:['', [Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    price:['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
    description:['', [Validators.required]],
    subCategoryId:['', [Validators.required]],
    brandId:['', [Validators.required]],
    setId:[{ value: '', disabled: true }],
      
  })

  this.editForm = this.fb.group({
    name:['', [Validators.required, Validators.maxLength(100)]],
    image:[],
    cardCode:['', [Validators.required]],
    stock:['', [Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    price:['', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
    description:['', [Validators.required]],
    subCategoryId:['', [Validators.required]],
    brandId:['', [Validators.required]],
    setId:['', [Validators.required]],
      
  })
  this.listProducts();
 }


 // Cuando un archivo es seleccionado desde el input
 onFileSelected(event: any): void {
  const file = event.target.files[0];
  console.log(file);
  if (file) {
     // Validación de tipo de archivo
     if (!file.type.startsWith('image/')) {
      this.toastr.error('Por favor selecciona un archivo de imagen', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
      });
      return;
    }
     // Validación de tamaño de archivo (por ejemplo, 5 MB)
     if (file.size > 5 * 1024 * 1024) {
      this.toastr.error('El archivo es demasiado grande. El límite es 5 MB.', 'Error', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
      });
      return;
    }

    this.previewImage(file);
  }
}

// Previsualiza la imagen
previewImage(file: File): void {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.previewUrl = e.target.result; // URL base64 generada
  };
  reader.readAsDataURL(file);
  this.imageFile = file;
}

// Cuando un archivo es arrastrado dentro de la zona
onDrop(event: DragEvent): void {
  event.preventDefault();
  this.isDragging = false;

  const files = event.dataTransfer?.files;
  if (files && files[0]) {
    this.previewImage(files[0]);
  }
}

// Cuando un archivo está siendo arrastrado dentro de la zona
onDragOver(event: DragEvent): void {
  event.preventDefault();
  this.isDragging = true;
}

// Cuando el archivo deja de ser arrastrado
onDragLeave(event: DragEvent): void {
  this.isDragging = false;
}

 listProducts(){
  this.productsService.getProducts().subscribe(
    {
      next: (res) => {
        this.products = res;
        this.feedDataSource(this.products);
      },
      error: (err) => {
        console.log(err);
      }
    }
  )
 }

 listSubCategories(){
  this.catalogService.getAllSubCategories().subscribe(
    {
      next: (res) => {
        this.subCategories = res;
      },
      error: (err) => {
        console.log(err);
      }
    }
  )
 }

 listBrands(){
  this.catalogService.getBrands().subscribe(
    {
      next: (res) => {
        this.brands = res;
      },
      error: (err) => {
        console.log(err);
      }
    }
  )
 }

  listSets(){
    this.catalogService.getSets().subscribe(
      {
        next: (res) => {
          this.sets = res;
        },
        error: (err) => {
          console.log(err);
        }
      }
    )
  }

  listSetsByBrand(id: any){
    this.catalogService.getSetsByBrand(id).subscribe(
      {
        next: (res) => {
          console.log(res);
          this.sets = res;
          // Si solo hay un set, seleccionarlo automáticamente
        if (this.sets.length === 1) {
          this.editForm.patchValue({ setId: this.sets[0].id });
        }
        },
        error: (err) => {
          console.log(err);
        }
      }
    )
  }

  openModalCreate() {
    this.modalCreate = true;
    this.listSubCategories();
    this.listBrands();
  }

  closeModalCreate() {
    this.modalCreate = false;
    this.createForm.reset();
  }

  onSubmitCreate() {
    console.log(this.createForm.valid);
    if(this.createForm.invalid){
      this.toastr.error('Formulario inválido', 'Error');
      return;
    }
    this.isSubmitting = true; // Evitar múltiples envíos
    const rawValue = this.createForm.value;
    const subCategoryIdNumber = Number(rawValue.subCategoryId);
    const brandIdNumber = Number(rawValue.brandId);
    const setIdNumber = Number(rawValue.setId);
  
    const formData = new FormData();
    formData.append('name', rawValue.name);
    formData.append('cardCode', rawValue.cardCode);
    formData.append('stock', rawValue.stock);
    formData.append('price', rawValue.price);
    formData.append('description', rawValue.description);
    formData.append('subCategoryId', subCategoryIdNumber.toString());
    formData.append('brandId', brandIdNumber.toString());
    formData.append('setId', setIdNumber.toString());
  
    if (this.imageFile) {
      formData.append('image', this.imageFile); // Importante: este nombre debe coincidir con el de @UploadedFile('image')
    }

  
    this.productsService.createProduct(formData).subscribe({
      next: (res: any) => {
        this.toastr.success('Producto creado correctamente', 'Éxito');
        this.listProducts();
        this.modalCreate = false;
        this.createForm.reset();
        this.previewUrl = null;
        this.imageFile = null;
        this.isSubmitting = false; // Permitir nuevos envíos
      },
      error: (err) => {
        this.isSubmitting = false; // Permitir nuevos envíos
        this.toastr.error('Error al crear el producto', 'Error');
      }
    });
  }

  handleEnterOrSubmitCreate(controlName: string, nextElement: HTMLElement) {
    const control = this.createForm.get(controlName);

    if (!control) return;
    
    control.markAsTouched();

    if (control.valid) {
      if (nextElement.tagName.toLowerCase() === 'button') {
        if (this.createForm.valid) {
          this.onSubmitCreate(); // Enviar formulario
        } else {
          this.createForm.markAllAsTouched(); // Mostrar errores
        }
      } else {
        nextElement.focus(); // Enfocar el siguiente campo
      }
    }
  }
  

  openModalEdit(data:any){
    console.log(data);
    this.modalEditar = true;
    this.idProducts = data.id; // Para usarlo en el update si lo necesitas

    this.editForm.patchValue({
      name: data.name,
      image: data.image,
      cardCode: data.cardCode,
      stock: data.stock,
      price: data.price,
      description: data.description,
      subCategoryId: data.subCategory.id,
      brandId: data.brandId,
      setId: data.setId
    });
     this.listSubCategories();
    this.listBrands();
    this.listSetsByBrand(data.brandId);
  this.previewUrl = data.image; // Mostrar la imagen existente
  }

  closeModalEdit() {
    this.editForm.reset();
    this.previewUrl = null; // Limpiar la previsualización de la imagen
    this.imageFile = null; // Limpiar el archivo de imagen
    this.idProducts = null; // Limpiar el ID del producto
    this.brands = []; // Limpiar las marcas
    this.sets = []; // Limpiar los sets
    this.subCategories = []; // Limpiar las subcategorías
    this.modalEditar = false;
    
  }



  onSubmitEdit(){
    if(!this.editForm.valid){
      this.toastr.error('Formulario inválido', 'Error');
      return;
    }
    this.isSubmitting = true; // Evitar múltiples envíos
    const formData = new FormData();
    formData.append('name', this.editForm.value.name);
    formData.append('cardCode', this.editForm.value.cardCode);
    formData.append('stock', this.editForm.value.stock);
    formData.append('price', this.editForm.value.price);
    formData.append('description', this.editForm.value.description);
    formData.append('subCategoryId', this.editForm.value.subCategoryId);
    formData.append('brandId', this.editForm.value.brandId);
    formData.append('setId', this.editForm.value.setId);
    if (this.imageFile) {
      // Si se seleccionó una nueva imagen, la añadimos
      formData.append('image', this.imageFile);
    } else if (this.previewUrl) {
      // Si no hay nueva imagen, añadimos la URL actual
      formData.append('image', this.previewUrl);
    }
    formData.forEach((value, key) => {
  console.log(`${key}: ${value}`);

});
  this.productsService.updateProducts(this.idProducts, formData).subscribe({

      next: (res: any) => {
        this.toastr.success('Producto actualizado correctamente', 'Éxito');
        this.listProducts();
        this.modalEditar = false;
        this.editForm.reset();
        this.previewUrl = null; // Limpiar la previsualización de la imagen
        this.imageFile = null; // Limpiar el archivo de imagen
        this.idProducts = null; // Limpiar el ID del producto
        this.brands = []; // Limpiar las marcas
        this.sets = []; // Limpiar los sets
        this.subCategories = []; // Limpiar las subcategorías
        this.isSubmitting = false; // Permitir nuevos envíos
      },
      error: (err) => {
        this.isSubmitting = false; // Permitir nuevos envíos
        this.toastr.error('Error al actualizar el producto', 'Error');
      }
    });
  }

  handleEnterOrSubmitEdit(controlName: string, nextElement: HTMLElement) {
    const control = this.editForm.get(controlName);

    if (!control) return;
    
    control.markAsTouched();

    if (control.valid) {
      if (nextElement.tagName.toLowerCase() === 'button') {
        if (this.editForm.valid) {
          this.onSubmitEdit(); // Enviar formulario
        } else {
          this.editForm.markAllAsTouched(); // Mostrar errores
        }
      } else {
        nextElement.focus(); // Enfocar el siguiente campo
      }
    }
  }

  openModalDelete(id:any){
    this.modalEliminar = true;
    this.idProducts = id; // Guardar el ID del producto a eliminar
    console.log(id);
  }

  closeModalDelete() {
    this.modalEliminar = false;
    this.idProducts = null; // Limpiar el ID del producto
  }

  openModalConfirmDelete() {
    this.modalConfirmarEliminar = true;
  }

  closeModalConfirmDelete() {
    this.modalConfirmarEliminar = false;
  }

  onSubmitDelete() {
    this.isSubmitting = true; // Evitar múltiples envíos
    this.productsService.deleteProducts(this.idProducts).subscribe({
      next: (res: any) => {
        
        this.toastr.success('Producto eliminado correctamente', 'Éxito');
        this.listProducts();
        this.modalConfirmarEliminar = false; // Cerrar el modal de confirmación
        this.modalEliminar = false;
        this.idProducts = null; // Limpiar el ID del producto
        this.isSubmitting = false; // Permitir nuevos envíos
      },
      error: (err) => {
        this.isSubmitting = false; // Permitir nuevos envíos
        this.toastr.error('Error al eliminar el producto', 'Error');
      }
    });
    
  }

 feedDataSource(data: any) {
       this.dataSource = new MatTableDataSource<any>(data);
       this.dataSource.paginator = this.paginator;
     }

     sortData(sort: Sort) {
               console.log(sort);
               const data = this.products.slice();
               if (!sort.active || sort.direction === '') {
                 this.feedDataSource(data);
                 return;
               }
               const sortedData = data.sort((a:any, b:any) => {
                 const isAsc = sort.direction === 'asc';
                 switch (sort.active) {
                   case 'id':
                     return compare(a.id, b.id, isAsc);
                   case 'name':
                     return compare(a.name, b.name, isAsc);
                   default:
                     return 0;
                 }
               });
           
               this.feedDataSource(sortedData);
             }
           
         onInputChange() {
           clearTimeout(this.timeout);
           this.timeout = setTimeout(() => {
             console.log('Palabra buscada' + this.searchText);
             this.filterData();
           }, 300);
         }
       
         filterData() {
           const search = this.searchText;
           const data = this.products.slice();
           if (!search) {
             this.feedDataSource(data);
             return;
           }
       
           const dataFiltered = data.filter((item:any) => {
             return item.name.includes(search);
           });
       
           this.feedDataSource(dataFiltered);
         }

         onSelectCategory(event: any) {
          const selectedCategoryId = event.value;
          const selectedCategory = this.categories.find((category: any) => category.id === selectedCategoryId) || null;
    
        }

        onSelectSubCategory(event: any) {
          const selectedSubCategoryId = event.value;

          const selectedSubCategory = this.subCategories.find((subCategory: any) => subCategory.id === selectedSubCategoryId) || null;
    
        }

        onSelectBrand(event: any) {
          const brandId = event.target.value;
  if (brandId) {
    this.listSetsByBrand(brandId);
    this.createForm.get('setId')?.enable(); // 🔥 habilitas el select
    this.editForm.get('setId')?.enable();
  } else {
    this.sets = []; // Si no hay marca seleccionada, limpias los sets
    this.createForm.patchValue({ setId: '' });
    this.editForm.patchValue({ setId: '' });
    this.createForm.get('setId')?.disable(); // 🔥 deshabilitas el select
  }
    
        }

        onSelectSet(event: any) {
          const selectedSetId = event.value;
          console.log(selectedSetId);
          const selectedSet = this.sets.find((set: any) => set.id === selectedSetId) || null;
    
        }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
