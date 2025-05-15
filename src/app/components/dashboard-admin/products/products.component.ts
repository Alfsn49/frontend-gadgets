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

 searchText: string = '';
      timeout: any = null;
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;

 constructor(){
  this.createForm = this.fb.group({
    name:[],
    image:[],
    cardCode:[],
    stock:[],
    price:[],
    description:[],
    subCategoryId:[],
    brandId:[],
    setId:[{ value: '', disabled: true }],
      
  })

  this.editForm = this.fb.group({
    name:[],
    image:[],
    cardCode:[],
    stock:[],
    price:[],
    description:[],
    subCategoryId:[],
    brandId:[],
    setId:[],
      
  })
  this.listProducts();
 }

 // Cuando un archivo es seleccionado desde el input
 onFileSelected(event: any): void {
  const file = event.target.files[0];
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
          this.sets = res;
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
    console.log(this.createForm.value);
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
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al crear el producto', 'Error');
      }
    });
  }
  

  openModalEdit(data:any){

  }

  openModalDelete(id: any) {
    this.modalEliminar = true;
   
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
          console.log(selectedSubCategoryId);
          const selectedSubCategory = this.subCategories.find((subCategory: any) => subCategory.id === selectedSubCategoryId) || null;
    
        }

        onSelectBrand(event: any) {
          const brandId = event.target.value;
  if (brandId) {
    this.listSetsByBrand(brandId);
    this.createForm.get('setId')?.enable(); // 🔥 habilitas el select
  } else {
    this.sets = []; // Si no hay marca seleccionada, limpias los sets
    this.createForm.patchValue({ setId: '' });
    this.createForm.get('setId')?.disable(); // 🔥 deshabilitas el select
  }
    
        }

        onSelectSet(event: any) {
          const selectedSetId = event.value;
          const selectedSet = this.sets.find((set: any) => set.id === selectedSetId) || null;
    
        }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
