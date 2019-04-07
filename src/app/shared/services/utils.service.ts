import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  // Вытаскиваем колонки из БД. Если нет данных - присваем пустой массив
  // 'JSON.parse' - переводит строку в обьект
  public getColumnsFromDatabase(): any {
    return JSON.parse(localStorage.getItem('columns')) || [];
  }

  /*
  Записываем колонки в БД. Если нет данных - присваем пустой массив
  JSON.stringify' - переводит обьект в строку
   */
  public setColumnsToDatabase(columns: any): any {
    return localStorage.setItem('columns', JSON.stringify(columns));
  }

  public searchItemById(id, dataArray): any {
    return dataArray.findIndex((item) => {
      return item.id === id;
    });
  }

  // генерация ИД
  public generateUniqueId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


}
