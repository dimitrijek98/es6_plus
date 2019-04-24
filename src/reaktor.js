import { fromEvent } from "rxjs";


export class Reaktor{
    constructor(id, kapacitet, mainSub$, cooling$){
        this.kapacitet = kapacitet;
        this.id = id;
        this.mainSub$ = mainSub$;

        this.hladjenje = 25;
        this.iskoriscenost = 50; 
        this.temperatura = 100;
       
        this.cooling$ = cooling$;
        console.log(this.mainSub$);
        
    }


    osluskuj(){
        this.cooling$.subscribe(value => {
            this.promeniHladjenje(value);
            this.izracunajTemperaturu();
        });

        const iskPlus = document.querySelectorAll(".snagaPlus")[this.id - 1];
        fromEvent(iskPlus, "click")
        .subscribe((val) => {
            this.povecajIskoriscenost();
            this.izracunajTemperaturu();
        });

        const iskMinus = document.querySelectorAll(".snagaMinus")[this.id - 1];
        fromEvent(iskMinus, "click")
        .subscribe((val) => {
            this.smanjiIskoriscenost();
            this.izracunajTemperaturu();
        });
        
    }

    promeniHladjenje(index){
        let intIndex = parseInt(index);
        if(intIndex>=0){
            if(intIndex === this.id){
                if(this.hladjenje < 99)
                    this.hladjenje += 1;
            }
            else{
                if(this.hladjenje > 1)
                    this.hladjenje -= 1/3;
            }
        }
        else {
            if(Math.abs(intIndex) === this.id){
                if(this.hladjenje > 1)
                    this.hladjenje -= 1;
            }
            else{
                if(this.hladjenje < 99)
                    this.hladjenje += 1/3;
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
        if(this.temperatura >= 150)
            setTimeout(()=> {
                if(this.temperatura >= 150)
                    this.ugasiElektranu();                
            },3000)
        
    }


    ugasiElektranu(){
        this.mainSub$.complete();
    }

    vratiTemperaturu(){
        return this.temperatura;
    }

    vratiIskoriscenost(){
        return this.iskoriscenost;
    }

    vratiHladjenje(){
        return this.hladjenje.toFixed(2);
    }

    vratiIzlaznuSnagu(){
        return (this.kapacitet*this.iskoriscenost/100).toFixed(2);
    }
    
}