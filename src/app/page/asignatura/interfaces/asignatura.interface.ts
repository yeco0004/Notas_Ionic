// src/app/interfaces/asignatura.interface.ts

export interface Nota {
    nota1: number | null; 
    nota2: number | null;
    nota3: number | null;
    nota4: number | null;
  }
  
  export interface Asignatura {
    nombre: string; // Nombre de la asignatura
    notas: Nota; // Contiene las notas
    notaFinal: number; // Nota final calculada
  }
  