

export class Reaktor{
    constructor(id, kapacitet, power$, cooling$){
        this.kapacitet = kapacitet;
        this.id = id;

        this.hladjenje = 25;
        this.iskoriscenost = 50; 
        this.temperatura = 100;
       
        this.power$ = power$;
        this.cooling$ = cooling$;

        this.osluskuj();
    }

    osluskuj(){
        this.cooling$.subscribe(value => {
            this.promeniHladjenje(value);
            this.izracunajTemperaturu();
        });
    }

    promeniHladjenje(index){
        let intIndex = parseInt(index);
        if(intIndex>=0){
            if(intIndex === this.id){
                this.hladjenje += 1;
                console.log(`Hladjenje reaktora ${this.id} se povecava i sada je ${this.hladjenje}`);
            }
            else{
                this.hladjenje -= 1/3;
                console.log(`Hladjenje reaktora ${this.id} se smanjuje i sada je ${this.hladjenje}`);
            }
        }
        else {
            if(Math.abs(intIndex) === this.id){
                this.hladjenje -= 1;
                console.log(`Hladjenje reaktora ${this.id} se povecava i sada je ${this.hladjenje}`);
            }
            else{
                this.hladjenje += 1/3;
                console.log(`Hladjenje reaktora ${this.id} se smanjuje i sada je ${this.hladjenje}`);
            }
        }

            
    }


    vratiHladjenje(){
        return this.hladjenje.toFixed(2);
    }

    izracunajTemperaturu(){
        this.temperatura = (100 + this.kapacitet * this.iskoriscenost/this.hladjenje * 10).toFixed(2);
        console.log(`Temperatura reaktora ${this.id} je ${this.temperatura}`);
        
    }

    izracunajIzlaznuSnagu(){
        return (kapacitet/iskoriscenost).toFixed(2);
    }


    
}