import { Component, inject } from '@angular/core';
import { UserStateService } from '../../../data-access/users/user-state.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { name } from '@cloudinary/url-gen/actions/namedTransformation';
import { last } from 'rxjs';
import { image } from '@cloudinary/url-gen/qualifiers/source';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
 private fb = inject(FormBuilder);
 userService = inject(UserStateService).loadUsers();
 userEditForm:FormGroup;

 constructor(){
  this.userEditForm = this.fb.group({
  name: [''],
  lastname: [''],
  email:[''],
  image:[''],
  CI:[''],
  birthdate:[''],
  telephone:[''],
  });
 }
}
