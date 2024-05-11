import { Persona } from "./persona.js";

export class Ciudadano extends Persona{
    constructor(id, nombre, apellido, fechaNacimiento, dni){
        super(id, nombre, apellido, fechaNacimiento);
        this.dni = dni;
    }

    toString(){
        return `Ciudadano: `+ super.toString() + `Dni: ${this.dni}`;
    }

    toJson(){
        return JSON.stringify(this);
    }
}