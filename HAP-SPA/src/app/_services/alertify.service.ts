import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor(private snackBar: MatSnackBar) { }

  success(message: string, action: string = 'close') {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass : 'successAlert',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
  error(message: string, action: string = 'close') {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass : 'dangerAlert',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
  info(message: string, action: string = 'close') {
    this.snackBar.open(message, action, {
      duration: 2000,
      panelClass : 'infoAlert',
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
