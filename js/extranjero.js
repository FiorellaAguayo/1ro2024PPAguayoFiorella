import { Persona } from "./persona.js";

export class Extranjero extends Persona{
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen)
    {
        super(id, nombre, apellido, fechaNacimiento);
        this.paisOrigen = paisOrigen;
    }

    toString() {
        return `Extranjero: ` + super.toString() + `Pais de origen: ${this.paisOrigen}`;
    }

    toJson(){
        return JSON.stringify(this);
    }
}