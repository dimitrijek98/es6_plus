import { Elektrana } from "./elektrana";
import { Subject, Observable } from "rxjs";
import { map,pairwise,filter, takeUntil } from "rxjs/operators";


const zahtevi$ = Observable.create(generator =>{
    setInterval(()=>generator.next((Math.random()+1)*3),15000);
})
const mainSubject$ = new Subject();
const view = document.createElement("div");
view.className = "container";
document.body.appendChild(view);
const elektrana = new Elektrana("Cernobil", view, mainSubject$, zahtevi$);
elektrana.feedback()
.pipe(
    pairwise(),
    filter(pair => pair[0] === pair[1]),
    map(pair => pair[0]),
    takeUntil(mainSubject$)
)
.subscribe((x)=>{
    
    if(!x){
        mainSubject$.complete();
    }
});
mainSubject$.subscribe(null,null,complete =>{
    alert("Elektrana je ugasena!");
})

console.log(elektrana);