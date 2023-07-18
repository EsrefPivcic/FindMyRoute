import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pretraga',
  templateUrl: 'pretraga.component.html',
  styleUrls: ['pretraga.component.css']
})
export class PretragaComponent implements OnInit {

  title:string = 'FindMyRoute';
  linijePodaci: any;
  grad1 : string;
  grad2 : string;
  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
  }

  GetLinijaByID(linija : any) {
    if (linija.presjedanje == "Direktna linija") {
      this.router.navigate(['/detalji', linija.id]);
    }
    else {
      this.router.navigate(['/detaljiPresjedanje', linija.id1, linija.id2, linija.cekanje]);
    }
  }

  pretraga() {
    this.grad1 = (document.getElementById('inputPolaziste') as HTMLInputElement).value;
    this.grad2 = (document.getElementById('inputDestinacija') as HTMLInputElement).value;
    console.log(this.grad1);
    console.log(this.grad2);
    fetch(MojConfig.adresa_servera+ "/Linija/GetByGradovi/gradovi?grad1="+this.grad1+"&grad2="+this.grad2)
      .then(
        r=> {
          if (r.status != 200) {
            if (r.status == 400) {
              alert("Molimo unesite nazive oba grada!");
            }
            else {
              alert("greska" + r.status);
            }
            return;
          }
          r.json().then(x=>{
            this.linijePodaci = x;
            if (this.linijePodaci.length != 0) {
              document.getElementById("tabela").style.opacity="1";
              document.getElementById("nemaRez").style.opacity="0";
            }
            else {
              document.getElementById("nemaRez").style.opacity="1";
              document.getElementById("tabela").style.opacity="0";
            }
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }
   PrikaziHelp(): void {
    // Create a form element dynamically
    const form = document.createElement("form");

    // Add form styling, attributes, and content
    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.backgroundColor = "#f8f9fa";
    form.style.padding = "20px";
    form.style.borderRadius = "8px";
    form.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.2)";

    // Add form content
    form.innerHTML = `
    <h3 style="margin-bottom: 10px; text-align: center;">Pomoć</h3>
    <div style="display: flex; flex-direction: column; gap: 10px;">
    <p>Dobrodošli na našu stranicu za pretragu autobusnih i voznih linija između gradova! Ovdje možete pronaći informacije o dostupnim linijama i rasporedu putovanja. Da biste koristili našu uslugu, slijedite sljedeće korake:</p>
<p> 1. Unesite grad polaska: U prvi tekstualni okvir, unesite ime grada iz kojeg želite započeti putovanje. Na primjer, možete unijeti "Livno".</p>
<p> 2. Unesite grad odredišta: U drugi tekstualni okvir, unesite ime grada u koji želite stići. Na primjer, možete unijeti "Mostar".</p>
<p> 3. Kliknite na dugme "Pretraži": Nakon što ste unijeli gradove polaska i odredišta, pritisnite dugme "Pretraži" kako biste pokrenuli pretragu linija.</p>
<p> 4. Prikaz rezultata: Nakon što pritisnete dugme "Pretraži", stranica će prikazati listu dostupnih autobusnih i voznih linija između unesenih gradova. Za svaku liniju bit će prikazani detalji kao što su vrijeme polaska, vrijeme dolaska, trajanje putovanja i broj presjedanja, ako ih ima.</p>
<p> 5. Odabir linije: Kada pronađete željenu liniju, kliknite na dugme "Detalji" za više detalja. Moći ćete vidjeti sve stanice na toj liniji, eventualna presjedanja i druge relevantne informacije.</p>
<p> To su osnovni koraci za korištenje naše stranice za pretragu autobusnih i voznih linija između gradova. Nadamo se da će vam naša usluga biti od pomoći prilikom planiranja vašeg putovanja. Uživajte u putovanju!</p>
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
    <button type="submit" style="margin-top: 10px; padding: 10px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Zatvori</button>
    </div>
  `;

    // Append the form to the body element
    document.body.appendChild(form);
  }
}
