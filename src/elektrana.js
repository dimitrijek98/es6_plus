import { Reaktor } from "./reaktor";
import { Subject} from "rxjs";
import { takeUntil } from "rxjs/operators";

export class Elektrana {

    constructor(naziv, roditelj, zahtevi$, powerPlantFail$){
        this.naziv = naziv;
        this.roditelj = roditelj;
        this.zahtevi$ = zahtevi$;
        this.powerPlantFail$ = powerPlantFail$;
        this.mainSubject$ = new Subject();
        this.cooling$ = null;
        this.feedback$ = new Subject();
        this.power$ = null;
        this.reaktori = [];
        this.reactors = null;
        this.konzola = null;
        this.PrikaziKontrolu();
        this.PrikaziReaktorPlaceholder();
    }

    PrikaziKontrolu(){
        const side = document.createElement("div");
        side.className = "side";
        this.roditelj.appendChild(side);

        const sifraLbl = document.createElement("label");
        sifraLbl.innerHTML = "Sifra radnika: ";
        side.appendChild(sifraLbl);

        const sifraTxt = document.createElement("input");
        sifraTxt.className = "sifraRadnika";
        side.appendChild(sifraTxt);

        const dugmici = document.createElement("div");
        dugmici.className = "dugmici";
        side.appendChild(dugmici);

        const pokreni = document.createElement("button");
        pokreni.innerHTML = "Pokreni";
        pokreni.className = "pokreni";
        pokreni.onclick = (ev) => this.pokreniElektranu(ev);
        dugmici.appendChild(pokreni);    

        
        const iskljuci = document.createElement("button");
        iskljuci.innerHTML = "Iskljuci";
        iskljuci.disabled = true;
        iskljuci.onclick = (ev) => this.iskljuciElektranu(ev);
        iskljuci.className = "iskljuci";
        
        dugmici.appendChild(iskljuci); 

        this.konzola = document.createElement("textarea");
        this.konzola.className = "konzola";
        side.appendChild(this.konzola);

        const demandsLbl = document.createElement("label");
        demandsLbl.innerHTML = "Zahtevi za ovaj sat su: ";
        demandsLbl.className = "demandsLbl";
        side.appendChild(demandsLbl);

        const demands = document.createElement("h2");
        demands.className = "demands";
        side.appendChild(demands);

        const ukupnaSnagaLbl = document.createElement("label");
        ukupnaSnagaLbl.innerHTML = "Trenutna ukupna snaga: ";
        ukupnaSnagaLbl.className = "ukupnaSnagaLbl";
        side.appendChild(ukupnaSnagaLbl);

        const ukupnaSnaga = document.createElement("h2");
        ukupnaSnaga.className = "ukupnaSnaga";
        side.appendChild(ukupnaSnaga);
    }

    PrikaziReaktorPlaceholder(){
        this.reactors = document.createElement("div");
        this.reactors.className = "reactors";
        this.roditelj.appendChild(this.reactors);
    }

    pokreniElektranu(ev){
        const teksPolje = document.querySelector(".sifraRadnika");
        fetch(`http://localhost:3000/radnici/${teksPolje.value}`)
        .then(radnik =>{    
            if(radnik.ok){               
                this.cooling$ = new Subject();
                this.power$ = new Subject();

                this.inicijalizacijaReaktora();    
                this.prikaziReaktore();
                this.izracunajUkupnuSnagu();

                this.pokreniSubscriptions();

                ev.target.disabled = true;
                const iskljuci = document.querySelector(".iskljuci");
                iskljuci.disabled = false;

                radnik.json()
                .then(rez=>{
                    this.ispisiNaKonzoli(`Pokretanje od strane radnika ${rez.ime} ${rez.prezime}`);
                    this.ispisiNaKonzoli("Zahtevi za energijom ce se ispisati kada budu stigli, budite u pripravnosti...");
                });
                
                
            }
            else
                this.ispisiNaKonzoli(`Doslo je do greske`);
            
        })        
        .catch(err => console.log(err));
    }

    inicijalizacijaReaktora(){
        for( let i = 0; i<4; i++){
            const kapacitet = Math.random() + 1;
            
            if(this.reaktori === []){
                this.reaktori.push(new Reaktor(i+1,kapacitet.toFixed(1),this.mainSubject$,this.cooling$,this.powerPlantFail$ ));
            }
            else{
                this.reaktori[i] = new Reaktor(i+1,kapacitet.toFixed(1),this.mainSubject$,this.cooling$, this.powerPlantFail$);
                
            }
        }
    }

    prikaziReaktore(){
        this.reaktori.map((reaktor,index) => {
            let reaktCont = document.createElement("div");
            reaktCont.className = "reactor";
            this.reactors.appendChild(reaktCont);
            this.PrikaziReaktor(reaktor,reaktCont,index+1);

        })

    }

    PrikaziReaktor(reaktor, container,index){
        
       
        let skala = document.createElement("div");
        skala.className = "skala";
        container.appendChild(skala);

        let popuna = document.createElement("div");
        popuna.className = "popuna";
        popuna.style.flexGrow = 0.5;
        skala.appendChild(popuna);

        let snaga = document.createElement("div");
        snaga.className = "plusMinus";
        container.appendChild(snaga);

        let snagaLbl = document.createElement("label");
        snagaLbl.innerHTML = "Snaga: ";
        snaga.appendChild(snagaLbl);
        
        let iznosSnage = document.createElement("label");
        iznosSnage.innerHTML = reaktor.iskoriscenost;
        iznosSnage.className = "iznos";
        snaga.appendChild(iznosSnage);

        let snagaBtnPlus = document.createElement("button");
        snagaBtnPlus.className = "snagaPlus";
        snagaBtnPlus.id = index;
        snagaBtnPlus.onclick = (ev) => this.power$.next(ev.target.id);
        snagaBtnPlus.innerHTML = "+";
        snaga.appendChild(snagaBtnPlus);
        
        let snagaBtnMinus = document.createElement("button");
        snagaBtnMinus.className = "snagaMinus";
        snagaBtnMinus.id = -index;
        snagaBtnMinus.onclick = (ev) => this.power$.next(ev.target.id);
        snagaBtnMinus.innerHTML = "-";        
        snaga.appendChild(snagaBtnMinus);
        
        let hladj = document.createElement("div");
        hladj.className = "plusMinus";
        container.appendChild(hladj);

        let hladjLbl = document.createElement("label");
        hladjLbl.innerHTML = "Hladjenje: ";
        hladj.appendChild(hladjLbl);
        
        let iznosHladj = document.createElement("label");
        iznosHladj.innerHTML = reaktor.vratiHladjenje();
        iznosHladj.className = "iznosH";
        hladj.appendChild(iznosHladj);

        let hladjBtnPlus = document.createElement("button");
        hladjBtnPlus.innerHTML = "+";
        hladjBtnPlus.id = index;
        hladjBtnPlus.onclick = (e) =>  this.cooling$.next(e.target.id);
        hladj.appendChild(hladjBtnPlus);
        
        let hladjBtnMinus = document.createElement("button");
        hladjBtnMinus.innerHTML = "-";
        hladjBtnMinus.id =  -index;
        hladjBtnMinus.onclick = (e) =>  this.cooling$.next(e.target.id);
        hladj.appendChild(hladjBtnMinus);

        this.reaktori[index-1].osluskuj();
    }

    izracunajUkupnuSnagu(){
        let iznosUkupneSnageLbl = document.querySelector(".ukupnaSnaga");
        let sum = 0.0;
        this.reaktori.map(reaktor =>{
            sum += parseFloat(reaktor.vratiIzlaznuSnagu());
        });
        iznosUkupneSnageLbl.innerHTML = sum.toFixed(2);
        return sum;
    }

    pokreniSubscriptions(){
        this.zahtevi$.pipe(
            takeUntil(this.mainSubject$)
        ).subscribe(val => {
            document.querySelector(".demands").innerHTML = val.toFixed(2);
            setTimeout(() => this.ispitivanjeIspunjenjaZahteva(val), 14500);
        });

        this.mainSubject$.subscribe(null,null,complete=>{
            this.iskljuciElektranu();
        });
    
        this.cooling$.subscribe(val => {
            let iznosHladjenjaLbl =  document.querySelectorAll(".iznosH");
            for(let i = 0; i < 4; i++){
                iznosHladjenjaLbl[i].innerHTML = this.reaktori[i].vratiHladjenje();
                this.promenaPopune(Math.abs(parseInt(i+1)));
            }
            
        });

        this.power$.subscribe(val => {
            setTimeout(() => {
                this.promenaSnage(val);
                this.izracunajUkupnuSnagu();
            },100);
        })
    }

    ispitivanjeIspunjenjaZahteva(val){
        let sum = this.izracunajUkupnuSnagu();
        if(val <= sum){
            this.feedback$.next(true);
            this.ispisiNaKonzoli("Ispunjeni su zahtevi za ovaj sat!");
        }
        else{
            this.feedback$.next(false);
            this.ispisiNaKonzoli("Nisu ispunjeni zahtevi za ovaj sat! Ukoliko se ne ispune dva puta za redom, elektrana ce se ugasiti!");
        }

    }

    ispisiNaKonzoli(poruka){
        this.konzola.innerHTML += `${poruka}` + "&#13;&#10";
    }

    promenaSnage(ind){
        let intIndex = Math.abs(parseInt(ind));
        let labela = document.querySelectorAll(".iznos")[intIndex-1];


        labela.innerHTML = this.reaktori[intIndex-1].vratiIskoriscenost();

        this.promenaPopune(intIndex);
    }

    promenaPopune(ind){
        let popuna = document.querySelectorAll(".popuna")[ind-1];
        let iskoriscenost = this.reaktori[ind-1].vratiIskoriscenost();
        popuna.style.flexGrow = iskoriscenost/100;
        if(this.reaktori[ind-1].vratiTemperaturu()>=150.0)
            popuna.style.background = 'red';
        else{
            popuna.style.background = 'green';
        }
    }

    iskljuciElektranu(){
        document.querySelector(".iskljuci").disabled = true;
        this.reactors.style.display = 'none';  
        this.mainSubject$.complete();
        this.PrikaziReaktorPlaceholder();    
    }

    feedback(){
        return this.feedback$;
    }

    vratiSubject(){
        return this.mainSubject$;
    }
}
