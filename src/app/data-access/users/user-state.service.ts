import { effect, inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { signalSlice } from 'ngxtension/signal-slice';
import { catchError, map, Observable, of, startWith, Subject, switchMap } from 'rxjs';

interface State{
  users:any | null;
  status: 'loading' | 'success' | 'error';
}
interface StateAddress{
  address:any | null;
  status: 'loading' | 'success' | 'error';
}
interface StateCreateAddress{
  address:any | null;
  status: 'loading' | 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private userService = inject(UserService);
  constructor() { }
  private initialState: State={
    users:[],
    status: 'loading' as const
  }
  private initialStateAddress: StateAddress={
    address:[],
    status: 'loading' as const
  }
  private initialStateCreateAddress: StateCreateAddress={
    address:[],
    status: 'loading' as const
  }

  private refreshTrigger = new Subject<void>();

  loadUsers(){
    let state = signalSlice({
      initialState: this.initialState,
      sources:[
        this.userService.profile().pipe(
          map((users)=>({
            users,
            status: 'success' as const
          })),
          catchError(()=>{
            return of({
              users:[],
              status: 'error' as const
            })
          })
        )
      ]
    })
    return state;
  }
  
  getAddress(){
    let state = signalSlice({
      initialState: this.initialStateAddress,
      sources:[
        this.userService.getaddress().pipe(
          map((address)=>({
            address,
            status: 'success' as const
          })),
          catchError(()=>{
            return of({
              address:[],
              status: 'error' as const
            })
          })
        )
      ]
    })
    return state;
  }
  
  refreshAddress() {
    this.refreshTrigger.next(); // Dispara el Subject para actualizar la dirección
  }
}
