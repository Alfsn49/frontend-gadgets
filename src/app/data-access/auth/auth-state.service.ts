import { inject, Injectable } from '@angular/core';
import {signalSlice} from 'ngxtension/signal-slice'
import { Rol } from '../../Dto/rol.dto';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

interface State{
  rols: Rol | null;
  status: 'loading' | 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private authService = inject(AuthService)
  constructor() { 
    
  }
  private initialState: State={
    rols:null,
    status: 'loading' as const,
  }

  state = signalSlice({
    initialState: this.initialState,
    sources:[
      this.authService.getRoles().pipe(map((rols)=>({
        rols,
        status:'success' as const
      })))
    ]
  })

  
}
