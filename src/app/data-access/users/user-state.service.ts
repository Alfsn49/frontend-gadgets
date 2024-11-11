import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { signalSlice } from 'ngxtension/signal-slice';
import { catchError, map, of, startWith, Subject, switchMap } from 'rxjs';

interface State{
  users:any | null;
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

  loadUsers(){
    let state = signalSlice({
      initialState: this.initialState,
      sources:[
        this.userService.profile().pipe(
          map((users)=>({
            users,
            status: 'success' as const
          }))
        )
      ]
    })
    return state;
  }
}
