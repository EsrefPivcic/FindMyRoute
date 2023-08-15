import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";
import {LoginInformacije} from "../_helpers/login-informacije";
import {stringify} from "@angular/compiler/src/util";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

const Broj = /^\d+$/;
const BrojRegex = new RegExp('Broj');
const Slova = /^[a-zA-Z\u010D\u0107\u017E\u0111\u0161]+$/u;
const SlovaRegex = new RegExp('Slova');

@Component({
  selector: 'app-upravljanjeLinije',
  templateUrl: './upravljanjeLinije.component.html',
  styleUrls: ['./upravljanjeLinije.component.css']
})

export class UpravljanjeLinijeComponent implements OnInit {
  txtGrad1: any;
  txtGrad2: any;
  txtPolazakSati: any;
  txtPolazakMinute: any;
  txtDolazakSati: any;
  txtDolazakMinute: any;
  chkPonedjeljak: boolean;
  chkUtorak: boolean;
  chkSrijeda: boolean;
  chkCetvrtak: boolean;
  chkPetak: boolean;
  chkSubota: boolean;
  chkNedjelja: boolean;
  txtKilometraza: any;
  txtCijena: any;
  linijePodaci: any;
  prevoznikPodaci: any;
  Logo: string;

  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.UcitajPrevoznika();
    this.UcitajLinije();
    console.log(this.linijePodaci);
  }

  UcitajLogo(id: number): void {
    const uniqueParam = new Date().getTime(); // Generate a unique timestamp
    this.Logo = `${MojConfig.adresa_servera}/Prevoznik/GetSlikaDB/${id}?v=${uniqueParam}`;
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  UcitajPrevoznika():void {
    fetch(MojConfig.adresa_servera+ "/Prevoznik/GetByRadnik/radnikId?radnikId="+this.loginInfo().autentifikacijaToken.korisnickiNalog.id)
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
            this.prevoznikPodaci = x;
            this.UcitajLogo(x.id);
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

    UcitajLinije(): void {
    fetch(MojConfig.adresa_servera+ "/Linija/GetByRadnik/radnikId?radnikId="+this.loginInfo().autentifikacijaToken.korisnickiNalog.id)
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
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  Validiraj(): boolean {
    if (this.txtGrad1 == null || this.txtGrad2 == null || this.txtPolazakSati == null || this.txtPolazakMinute == null ||
      this.txtDolazakSati == null || this.txtDolazakMinute == null || this.txtCijena == null || this.txtKilometraza == null) {
      porukaError("Sva polja su obavezna!");
      return false;
    }
    if (!this.txtGrad1.match(Slova) || !this.txtGrad2.match(Slova)) {
      porukaError("Za unos imena gradova dozvoljena su samo slova od A do Ž!");
      return false;
    }
    if (!this.txtKilometraza.match(Broj) || !this.txtCijena.match(Broj)) {
      porukaError("Za unos kilometraže i cijene dozvoljeni su samo brojevi!");
      return false;
    }
    return true;
  }

  btnDodajLiniju() {
    if (this.Validiraj()) {
      let saljemo = {
        grad1: this.txtGrad1,
        grad2: this.txtGrad2,
        prevoznik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        polazakSati: this.txtPolazakSati,
        polazakMinute: this.txtPolazakMinute,
        dolazakSati: this.txtDolazakSati,
        dolazakMinute: this.txtDolazakMinute,
        ponedjeljakVoznja: this.chkPonedjeljak,
        utorakVoznja: this.chkUtorak,
        srijedaVoznja: this.chkSrijeda,
        cetvrtakVoznja: this.chkCetvrtak,
        petakVoznja: this.chkPetak,
        subotaVoznja: this.chkSubota,
        nedjeljaVoznja: this.chkNedjelja,
        kilometraza: this.txtKilometraza,
        cijena: this.txtCijena,
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Linija/AddByRadnik`, saljemo, MojConfig.http_opcije()).subscribe(x => {
        this.txtGrad1 = null;
        this.txtGrad2 = null;
        this.txtPolazakSati = null;
        this.txtPolazakMinute = null;
        this.txtDolazakSati = null;
        this.txtDolazakMinute = null;
        this.chkPonedjeljak = false;
        this.chkUtorak = false;
        this.chkSrijeda = false;
        this.chkCetvrtak = false;
        this.chkPetak = false;
        this.chkSubota = false;
        this.chkNedjelja = false;
        this.txtKilometraza = null;
        this.txtCijena = null;
        this.ngOnInit();
        porukaSuccess("Linija je uspješno dodana!")
      });
    }
  }

  Detalji(linija : any) {
    if (linija.presjedanje == "Direktna linija") {
      this.router.navigate(['/detalji', linija.id]);
    }
    else {
      this.router.navigate(['/detaljiPresjedanje', linija.id1, linija.id2]);
    }
  }

  UkloniLiniju(linija: any) {
    this.httpKlijent.delete(`${MojConfig.adresa_servera}/Linija/Delete/${linija.id}`, MojConfig.http_opcije()).subscribe(x=>{
      this.ngOnInit();
    });
  }

  PrikaziHelp(): void {
    const form = document.createElement("form");

    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.backgroundColor = "#333333";
    form.style.color = "white";
    form.style.padding = "20px";
    form.style.borderRadius = "8px";
    form.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.2)";

    form.innerHTML = `
    <h3 style="margin-bottom: 10px; text-align: center;">Pomoć</h3>
    <div style="display: flex; flex-direction: column; gap: 10px;">
<p>Ova stranica je namijenjena isključivo zaposlenicima naše firme kako bi mogli efikasno upravljati linijama. Na ovoj stranici možete dodavati nove linije, pregledati postojeće i upravljati njima.</p>
<p>Dodavanje nove linije:<br>
Unesite polazište, destinaciju, vrijeme polaska i dolaska, dane u sedmici kada je vožnja moguća, kilometražu i cijenu karte.<br>
Nakon što ste unijeli sve potrebne podatke, kliknite na "Dodaj liniju" kako biste pohranili novu liniju u našu bazu podataka.</p>
<p>Pregled postojećih linija:<br>
Na stranici se nalazi i tabela sa svim linijama našeg prevoznika. Tablica prikazuje polazište, destinaciju, vrijeme polaska, vrijeme dolaska i cijenu karte za svaku liniju. Ovdje možete brzo pregledati sve dostupne linije.</p>
<p>Detalji o liniji:<br>
Ako želite vidjeti više detalja o određenoj liniji, kliknite na dugme "Detalji" uz odgovarajući red u tablici. Tako ćete dobiti sve informacije o toj liniji, uključujući i kilometražu i dane u sedmici kada je vožnja moguća.</p>
<p>Uklanjanje linije:<br>
Ukoliko je neka linija prestala biti u upotrebi ili je potrebno ukloniti liniju iz baze podataka, kliknite na dugme "Ukloni liniju" uz odgovarajući red u tablici. Ova akcija će trajno izbrisati liniju iz naše baze podataka.</p>
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
        <button id="closeBtn" style="margin-top: 10px; padding: 10px; background-color: #0056b3; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Zatvori</button>
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
