import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import { NavigationExtras } from '@angular/router';
import {LoginInformacije} from "../_helpers/login-informacije";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";

@Component({
  selector: 'app-historijaKupovine',
  templateUrl: 'historijaKupovine.component.html',
  styleUrls: ['historijaKupovine.component.css']
})
export class HistorijaKupovineComponent implements OnInit {
  historijaKupovine: any;
  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  formatirajDatum(datum: string): string {
    const skraceniDatum = datum.substring(0, 10);
    const date = new Date(skraceniDatum);
    const formatiraniDatum = date.toLocaleDateString('en-GB');
    return formatiraniDatum;
  }

  GetDetaljiLinije(linija : any) {
    this.router.navigate(['/detalji', linija.linija.id]);
  }

  GetDetaljiKupovine(kupovina : any) {
    this.router.navigate(['/detaljiKupovine', kupovina.id]);
  }

  ngOnInit(): void {
    fetch(MojConfig.adresa_servera+ "/Kupovina/GetByKorisnik/korisnikId?korisnikId="+this.loginInfo().autentifikacijaToken.korisnickiNalog.id)
      .then(
        r=> {
          if (r.status != 200) {
            if (r.status == 400) {
              alert("Error!");
            }
            else {
              alert("greska" + r.status);
            }
            return;
          }
          r.json().then(x=>{
            this.historijaKupovine = x;
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
    const form = document.createElement("form");

    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.backgroundColor = "#3a3a5c";
    form.style.color = "white";
    form.style.padding = "20px";
    form.style.borderRadius = "8px";
    form.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.2)";

    form.innerHTML = `
    <h3 style="margin-bottom: 10px; text-align: center;">Pomoć</h3>
    <div style="display: flex; flex-direction: column; gap: 10px;">
<p>Ovdje možete pregledati sve Vaše prijašnje putne transakcije kako biste imali uvid u Vaše prethodne vožnje i kupovine karata. U nastavku su prikazani detalji svake kupovine.</p>
<p>Polazište: Ovdje je navedeno mjesto polaska Vaše vožnje.<br>
Destinacija: Prikazuje odredište do kojeg ste putovali.<br>
Prevoznik: Ovdje je naziv prevoznika koji je obavljao Vašu vožnju.<br>
Datum vožnje: Datum na kojem ste obavili putovanje.<br>
Ukupna cijena: Ovo je iznos koji ste platili za kartu ili karte.<br>
Način plaćanja: Navodi način na koji ste izvršili plaćanje, kao što su kreditna kartica ili PayPal.</p>
<p>Detalji linije: Klikom na ovo dugme otvara se novi prozor s dodatnim informacijama o liniji.</p>
<p>Detalji kupovine: Klikom na ovo dugme otvara se novi prozor koji prikazuje sve pojedinosti o Vašoj kupovini.</p>
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
        <button id="closeBtn" style="margin-top: 10px; padding: 10px; background-color: #5a5a8d; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Zatvori</button>
    </div>
  `;

    document.body.appendChild(form);

    const closeButton = document.getElementById("closeBtn");
    if (closeButton) {
      closeButton.addEventListener("click", (event) => {
        event.preventDefault();
        form.remove();
      });
    }
  }

}
