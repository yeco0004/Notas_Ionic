import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Asignatura } from '../page/asignatura/interfaces/asignatura.interface';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private almacenamiento: Storage | null = null;

  constructor(private storage: Storage) { 
    this.init();
  }

  async init(){ //Inicio de almacenamiento
    const storage = await this.storage.create();
    this.almacenamiento = storage;
  }

  //guardar asignatura con sus notas
  public async setAsignatura(nombre: string, notas: any): Promise<void> {
    const asignaturas = await this.getAsignatura();
    asignaturas[nombre] = notas;
    await this.almacenamiento?.set('asignaturas', asignaturas);
  }

  //Eliminar Asignatura
  eliminiarAsignatura(nombre: string): Promise<void> {
    return this.storage.get('asignaturas').then((asignaturas: any) =>{
      if(asignaturas){
        delete asignaturas[nombre];
        return this.storage.set('asignaturas', asignaturas);
      }
        return Promise.resolve();
    });
  }

  //Obtener asignaturas
  public async getAsignatura(): Promise<Record<string, Asignatura>>{
    const asignaturas = await this.almacenamiento?.get('asignaturas'); 
    return asignaturas || {};// retorna el objeto vacio si no hay datos
  }

}
