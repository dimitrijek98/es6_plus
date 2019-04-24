import { fromEvent } from "rxjs";


export class Reaktor{
    constructor(id, kapacitet, power$, cooling$){
        this.kapacitet = kapacitet;
        this.id = id;

        this.hladjenje = 25;
        this.iskoriscenost = 50; 
        this.temperatura = 100;
       
        this.cooling$ = cooling$;
        console.log(this.id);
        this.osluskuj();
    }

    osluskuj(){
        this.cooling$.subscribe(value => {
            this.promeniHladjenje(value);
            this.izracunajTemperaturu();
        });

        /*const iskPlus = document.querySelectorAll(".snagaPlus");
        fromEvent(iskPlus, "click")
        .subscribe((val) => {
            this.povecajIskoriscenost();
            this.izracunajTemperaturu();
        });

        const reaktor = document.querySelectorAll(".reactors")[this.id];
        const iskMinus = reaktor.querySelector(".snagaMinus");
        console.log(iskMinus);
        fromEvent(iskMinus, "click")
        .subscribe((val) => {
            this.smanjiIskoriscenost();
            this.izracunajTemperaturu();
        });*/
        
    }

    promeniHladjenje(index){
        let intIndex = parseInt(index);
        if(intIndex>=0){
            if(intIndex === this.id){
                if(this.hladjenje < 99)
                    this.hladjenje += 1;
                console.log(`Hladjenje reaktora ${this.id} se povecava i sada je ${this.hladjenje}`);
            }
            else{
                if(this.hladjenje > 1)
                    this.hladjenje -= 1/3;
                console.log(`Hladjenje reaktora ${this.id} se smanjuje i sada je ${this.hladjenje}`);
            }
        }
        else {
            if(Math.abs(intIndex) === this.id){
                if(this.hladjenje > 1)
                    this.hladjenje -= 1;
                console.log(`Hladjenje reaktora ${this.id} se povecava i sada je ${this.hladjenje}`);
            }
            else{
                if(this.hladjenje < 99)
                    this.hladjenje += 1/3;
                console.log(`Hladjenje reaktora ${this.id} se smanjuje i sada je ${this.hladjenje}`);
            }
        }

            
    }

    povecajIskoriscenost(){
        if(this.iskoriscenost < 100)
            this.iskoriscenost++;
    }

    smanjiIskoriscenost(){
        if(this.iskoriscenost > 0)
            this.iskoriscenost--;
    }

    izracunajTemperaturu(){
        this.temperatura = (100 + this.kapacitet * this.iskoriscenost/this.hladjenje * 10).toFixed(2);
        console.log(`Temperatura reaktora ${this.id} je ${this.temperatura}`);
        
    }

    vratiHladjenje(){
        return this.hladjenje.toFixed(2);
    }

    vratiIzlaznuSnagu(){
        return (kapacitet/iskoriscenost).toFixed(2);
    }
    
}