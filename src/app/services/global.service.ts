import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import 'select2';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor() {}

  initializeSelect2(placeholder: string): void {
    ($('.select2') as any).select2({
      theme: "bootstrap",
      placeholder: placeholder,
      allowClear: true,
      width: '100%'
    });
  }
}