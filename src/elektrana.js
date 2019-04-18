import { Reaktor } from "./reaktor";

export class Elektrana {
    constructor(naziv, roditelj){
        this.naziv = naziv;
        this.roditelj = roditelj

        this.reactors = null;
        this.konzola = null;


        this.InicijalizacijaReaktora();
        
        this.PrikaziKontrolu();
        this.PrikaziReaktorPlaceholder();
        

    }

    InicijalizacijaReaktora(){
        this.reaktori = [];
        for( let i = 0; i<4; i++){
            const kapacitet = Math.random() + 1;
            this.reaktori.push(new Reaktor(kapacitet.toFixed(1)));
        }
    }

    PrikaziReaktorPlaceholder(){
        this.reactors = document.createElement("div");
        this.reactors.className = "reactors";
        this.roditelj.appendChild(this.reactors);
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
    }

    pokreniElektranu(ev){
        const teksPolje = document.querySelector(".sifraRadnika");
        fetch(`http://localhost:3000/radnici/${teksPolje.value}`)
        .then(radnik =>{    
            if(radnik.ok){    
               this.PrikaziReaktore();
               ev.target.disabled = true;
               const iskljuci = document.querySelector(".iskljuci");
               iskljuci.disabled = false;
               radnik.json().then(rez=>this.konzola.innerHTML += `Pokretanje od strane radnika ${rez.ime} ${rez.prezime} `+ "&#13;&#10");
            }
            else
                this.konzola.innerHTML += `Doslo je do greske `+ "&#13;&#10";
            
        })        
        .catch(err => console.log(err))
    }

    iskljuciElektranu(ev){
        ev.target.disabled = true;
        this.reactors.style.display = 'none';  
        this.PrikaziReaktorPlaceholder();    
        const pokreni = document.querySelector(".pokreni");
        pokreni.disabled = false;
    }

    PrikaziReaktore(){                
        
        this.reaktori.map(reaktor => {
            let reaktCont = document.createElement("div");
            reaktCont.className = "reactor";
            this.reactors.appendChild(reaktCont);
            this.PrikaziReaktor(reaktor,reaktCont);
        })

    }


    PrikaziReaktor(reaktor, container){
        let skala = document.createElement("div");
        skala.className = "skala";
        container.appendChild(skala);

        let popuna = document.createElement("div");
        popuna.className = "popuna";
        skala.appendChild(popuna);

        let snaga = document.createElement("div");
        snaga.className = "plusMinus";
        container.appendChild(snaga);

        let snagaLbl = document.createElement("label");
        snagaLbl.innerHTML = "Snaga: "
        snaga.appendChild(snagaLbl);
        
        let iznosSnage = document.createElement("label");
        iznosSnage.innerHTML = reaktor.iskoriscenost;
        iznosSnage.className = "iznos";
        snaga.appendChild(iznosSnage);

        let snagaBtnPlus = document.createElement("button");
        snagaBtnPlus.innerHTML = "+";
        snaga.appendChild(snagaBtnPlus);
        
        let snagaBtnMinus = document.createElement("button");
        snagaBtnMinus.innerHTML = "-";
        snaga.appendChild(snagaBtnMinus);
        
        let hladj = document.createElement("div");
        hladj.className = "plusMinus";
        container.appendChild(hladj);

        let hladjLbl = document.createElement("label");
        hladjLbl.innerHTML = "Hladjenje: "
        hladj.appendChild(hladjLbl);
        
        let iznosHladj = document.createElement("label");
        iznosHladj.innerHTML = reaktor.iskoriscenost;
        iznosHladj.className = "iznos";
        hladj.appendChild(iznosHladj);

        let hladjBtnPlus = document.createElement("button");
        hladjBtnPlus.innerHTML = "+";
        hladj.appendChild(hladjBtnPlus);
        
        let hladjBtnMinus = document.createElement("button");
        hladjBtnMinus.innerHTML = "-";
        hladj.appendChild(hladjBtnMinus);
    }

    
    

    
}