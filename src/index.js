import {Elektrana} from "./elektrana";
import {Subject, Observable, race} from "rxjs";
import {map, pairwise, filter, takeUntil} from "rxjs/operators";

const zahtevi$ = Observable.create(generator => {
    setInterval(() => generator.next((Math.random() + 1) * 2.5), 15000);
});

const requirementsFail$ = new Subject();
const powerPlantFail$ = new Subject();

const view = document.createElement("div");
view.className = "container";
document.body.appendChild(view);

const elektrana = new Elektrana("Cernobil", view, zahtevi$, powerPlantFail$);
const mainSubject$ = elektrana.vratiSubject();

elektrana.feedback()
    .pipe(
        pairwise(),
        filter(pair => pair[0] === pair[1]),
        map(pair => pair[0]),
        takeUntil(mainSubject$)
    )
    .subscribe((x) => {
        if (!x) {
            requirementsFail$.next("neispunjenje zahteva dva puta za redom")
        }
    });

race(requirementsFail$, powerPlantFail$)
    .subscribe(failMessage => {
            mainSubject$.complete();
            alert(`Elektrana je ugasena! Razlog tome je: ${failMessage}.`);
        }
    );

