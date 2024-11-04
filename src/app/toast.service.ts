// toast.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<string>();

  getToast(): Observable<string> {
    return this.toastSubject.asObservable();
  }

  showToast(message: string) {
    this.toastSubject.next(message);
  }
}
