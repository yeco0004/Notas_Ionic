import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { Asignatura } from './interfaces/asignatura.interface';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.page.html',
  styleUrls: ['./asignatura.page.scss'],
})
export class AsignaturaPage implements OnInit {

  asignatura: Asignatura ={
    nombre: '',
    notas: {
      nota1: null,
      nota2: null,
      nota3: null,
      nota4: null
    },
    notaFinal: 0  
  };

  asignaturas: Record<string, Asignatura> ={};

  constructor(private storageService: StorageService, private alertController: AlertController) { }

  ngOnInit() {
    this.cargarAsignaturas(); // Cargar asignaturas al inicializar la página
  }

  cargarAsignaturas(){
    this.storageService.getAsignatura().then((data) => {
      this.asignaturas = data;
    });
  }

  //Calcular Nota Final
  calcularFinal(){
    const nota1 = this.asignatura.notas.nota1 || 0;
    const nota2 = this.asignatura.notas.nota2 || 0;
    const nota3 = this.asignatura.notas.nota3 || 0;
    const nota4 = this.asignatura.notas.nota4 || 0;

    this.asignatura.notaFinal = 
    (nota1 * 0.20) + 
    (nota2 * 0.20) +
    (nota3 * 0.20) +
    (nota4 * 0.40); 
  }

  //validad Notas
  async validarNota(){
    const nota1 = this.asignatura.notas.nota1 || 0;
    const nota2 = this.asignatura.notas.nota2 || 0;
    const nota3 = this.asignatura.notas.nota3 || 0;
    const nota4 = this.asignatura.notas.nota4 || 0;

    if(
      nota1 < 0 || nota1 > 5||
      nota2 < 0 || nota2 > 5 ||
      nota3 < 0 || nota3 > 5 ||
      nota4 < 0 || nota4 > 5) {
      await this.mostrarAlerta ("Error en las notas", " ¿Las notas deben estar entre 0 y 5");
      return false;
    }
    return true;
  }

  // Método para mostrar la alerta de error
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  //guardar asignatura y notas
  async guardarAsignatura(){ 
    if (await this.validarNota()){
      this.calcularFinal();
      this.storageService.setAsignatura(this.asignatura.nombre,{
        notas: this.asignatura.notas,
        notaFinal: this.asignatura.notaFinal
      }).then(() => {
        this.cargarAsignaturas();
        this.resetFormulario();
      }).catch (error => {
          console.error('error al guardar asignatura:', error);
      });
    }
    
    
  }

  resetFormulario() {
    this.asignatura = {
      nombre: '',
      notas: {
        nota1: null,
        nota2: null,
        nota3: null,
        nota4: null
      },
      notaFinal: 0
    };
  }

  //Editar
  editarAsignatura(nombre: string, datos: Asignatura){
    this.asignatura.nombre = nombre;
    this.asignatura.notas = { ...datos.notas};
    this.asignatura.notaFinal = datos.notaFinal;
  }

  //eliminar
  eliminarAsignatura(nombre: string){

    //elimina asignatura del objeto de memoria
    delete this.asignaturas[nombre]; 

    //eliminar la asignatura del almacenamiento
    this.storageService.eliminiarAsignatura(nombre).then(() => {
      console.log(`${nombre} eliminada`);
      this.cargarAsignaturas();
    }).catch((error => {
      console.error('error al eliminar la asignatura:', error);
    }));
  }

  formValido(): boolean {
    return (
      this.asignatura.nombre.trim() !== '' &&
      this.asignatura.notas.nota1 !== null &&
      this.asignatura.notas.nota2 !== null &&
      this.asignatura.notas.nota3 !== null &&
      this.asignatura.notas.nota4 !== null 
    );
  }

}
