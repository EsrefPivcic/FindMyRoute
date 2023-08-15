import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {LoginInformacije} from "../_helpers/login-informacije";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

const BrojTelefona = /[0-9]{8}/;
const BrojTelefonaRegex = new RegExp('BrojTelefona');
const Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const EmailRegex = new RegExp('Email');

@Component({
  selector: 'app-upravljanje',
  templateUrl: './upravljanje.component.html',
  styleUrls: ['./upravljanje.component.css']
})

export class UpravljanjeComponent implements OnInit {
  @ViewChild('slikaInput') slikaInputRef!: ElementRef<HTMLInputElement>;
  prevoznici: boolean = null;
  txtNaziv: any;
  txtAdresa: any;
  txtEmail: any;
  txtBrojTelefona: any;
  prevoznikPodaci: any;
  txtIme: any;
  txtPrezime: any;
  txtEmailRadnik: any;
  txtKorisnickoIme: any;
  txtLozinka: any;
  txtAdresaRadnik: any;
  txtBrojTelefonaRadnik: any;
  txtPozicija: any;
  txtRadniStaz: any;
  txtPrevoznik: any;
  txtPIN: any = "";
  radnikPodaci: any;
  slikaPrikaz: boolean = false;
  Slika: string = "";
  adminPermisije: boolean = false;

  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.UcitajPrevoznike();
    this.UcitajRadnike();
    if (this.prevoznici == true) {
      document.getElementById("btnPrevoznici").className = "btn btn-outline-primary";
      document.getElementById("btnRadnici").className = "btn btn-outline-secondary";
    }
    else {
      document.getElementById("btnPrevoznici").className = "btn btn-outline-secondary";
      document.getElementById("btnRadnici").className = "btn btn-outline-primary";
    }
  }

  Radnici(): void {
    this.prevoznici = false;
    document.getElementById("btnPrevoznici").className = "btn btn-outline-secondary";
    document.getElementById("btnRadnici").className = "btn btn-outline-primary";
  }

  Prevoznici(): void {
    document.getElementById("btnPrevoznici").className = "btn btn-outline-primary";
    document.getElementById("btnRadnici").className = "btn btn-outline-secondary";
    this.prevoznici = true;
  }

  UcitajPrevoznike(): void {
    fetch(MojConfig.adresa_servera+ "/Prevoznik/GetAll")
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
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  btnPIN(): void {
    if (this.ValidirajPIN()) {
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        pin: this.txtPIN,
      };
      this.httpKlijent.post<boolean>(`${MojConfig.adresa_servera}/Administrator/PotvrdiPIN`, podaci, MojConfig.http_opcije()).subscribe(
        (potvrda: boolean) => {
          this.txtPIN = null;
          if (potvrda) {
            this.adminPermisije = true;
            porukaSuccess("PIN ispravan!");
          }
          else {
            porukaError("Neispravan PIN!");
          }
        },
        (error) => {
          porukaError("Došlo je do greške prilikom provjere PIN-a.");
        }
      );
    }
    else {
      porukaError("Molimo unesite PIN!");
    }
  }


  ValidirajPIN(): boolean {
    if (this.txtPIN == "") {
      return false;
    }
    return true;
  }

  UcitajRadnike(): void {
    fetch(MojConfig.adresa_servera+ "/RadnikFirme/GetAll")
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
            this.radnikPodaci = x;
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
    if (this.txtNaziv == null || this.txtAdresa == null || this.txtEmail == null || this.txtBrojTelefona == null) {
      porukaError("Sva polja su obavezna!");
      return false;
    }
    if (!this.txtBrojTelefona.match(BrojTelefona)) {
      porukaError("Molimo unesite ispravan broj telefona!");
      return false;
    }
    if (!this.txtEmail.match(Email)) {
      porukaError("Molimo unesite ispravan email!");
      return false;
    }
    return true;
  }

  ValidirajRadnike(): boolean {
    if (this.txtIme == null || this.txtPrezime == null || this.txtEmailRadnik == null || this.txtKorisnickoIme == null ||
      this.txtLozinka == null || this.txtAdresaRadnik == null || this.txtBrojTelefonaRadnik == null || this.txtPozicija == null ||
      this.txtRadniStaz == null || this.txtPrevoznik == null) {
      porukaError("Sva polja su obavezna!");
      return false;
    }
    if (!this.txtBrojTelefonaRadnik.match(BrojTelefona)) {
      porukaError("Molimo unesite ispravan broj telefona!");
      return false;
    }
    if (!this.txtEmailRadnik.match(Email)) {
      porukaError("Molimo unesite ispravan email!");
      return false;
    }
    return true;
  }

  Preview() {
    // @ts-ignore
    var file = document.getElementById("slika-input").files[0];
    if (file) {
      var reader = new FileReader();
      let this2=this;
      reader.onload = function () {
        this2.Slika = reader.result?.toString();
      }
      reader.readAsDataURL(file);
      this.slikaPrikaz = true;
    }
  }

  btnDodajPrevoznika() {
    if (this.Validiraj()) {
      let saljemo = {
        naziv: this.txtNaziv,
        adresa: this.txtAdresa,
        email: this.txtEmail,
        brojTelefona: "+387" + this.txtBrojTelefona,
        logo: this.Slika
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Prevoznik/Add`, saljemo, MojConfig.http_opcije()).subscribe(x => {
        this.txtNaziv = null;
        this.txtAdresa = null;
        this.txtEmail = null;
        this.txtBrojTelefona = null;
        this.slikaInputRef.nativeElement.value = '';
        this.slikaPrikaz = false;
        this.Slika = "";
        this.ngOnInit();
        porukaSuccess("Prevoznik je uspješno dodan!")
      });
    }
  }

  btnDodajRadnika() {
    if (this.ValidirajRadnike()) {
      let saljemo = {
        ime: this.txtIme,
        prezime: this.txtPrezime,
        email: this.txtEmailRadnik,
        korisnickoIme: this.txtKorisnickoIme,
        lozinka: this.txtLozinka,
        adresa: this.txtAdresaRadnik,
        brojTelefona: "+387" + this.txtBrojTelefonaRadnik,
        pozicija: this.txtPozicija,
        radniStaz: this.txtRadniStaz,
        prevoznik_id: this.txtPrevoznik
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/RadnikFirme/Add`, saljemo, MojConfig.http_opcije()).subscribe(x => {
        this.txtIme = null;
        this.txtPrezime = null;
        this.txtEmailRadnik = null;
        this.txtKorisnickoIme = null;
        this.txtLozinka = null;
        this.txtAdresaRadnik = null;
        this.txtBrojTelefonaRadnik = null;
        this.txtPozicija = null;
        this.txtRadniStaz = null;
        this.txtPrevoznik = null;
        this.ngOnInit();
        porukaSuccess("Radnik je uspješno dodan!")
      });
    }
  }

  UkloniPrevoznika(prevoznik: any) {
    this.httpKlijent.delete(`${MojConfig.adresa_servera}/Prevoznik/Delete/${prevoznik.id}`, MojConfig.http_opcije()).subscribe(x=>{
      this.ngOnInit();
    });
  }

  UkloniRadnika(radnik: any) {
    this.httpKlijent.delete(`${MojConfig.adresa_servera}/RadnikFirme/Delete/${radnik.id}`, MojConfig.http_opcije()).subscribe(x=>{
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
<p>Ova stranica je namijenjena isključivo administratorima kako bi mogli učinkovito upravljati prevoznicima. Ovdje možete dodavati nove prevoznike i upravljati postojećim podacima.</p>
<p>Dodavanje novog prevoznika:<br>
Unesite naziv prevoznika, adresu, e-mail adresu, broj telefona i odaberite logo fotografiju klikom na "Choose file".<br>
Nakon što ste unijeli sve potrebne podatke, kliknite na "Dodaj prevoznika" kako biste pohranili nove informacije u našu bazu podataka.</p>
<p>Pregled postojećih prevoznika:<br>
Na stranici se nalazi i tabela sa svim trenutno postojećim prevoznicima. Tablica prikazuje naziv, adresu, e-mail adresu i broj telefona za svakog prevoznika. Ovdje možete brzo pregledati sve dostupne prevoznike.</p>
<p>Uklanjanje prevoznika:<br>
Ukoliko je neki prevoznik prestao biti aktivan ili je potrebno ukloniti prevoznika iz baze podataka, kliknite na dugme "Ukloni prevoznika" uz odgovarajući red u tablici. Ova akcija će trajno ukloniti prevoznika iz naše baze podataka.</p>
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

  PrikaziHelp2(): void {
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
<p>Ova stranica je namijenjena isključivo administratorima kako bi mogli učinkovito upravljati radnicima naših firmi. Ovdje možete dodavati nove radnike i upravljati postojećim podacima o zaposlenicima.</p>
<p>Dodavanje novog radnika:<br>
Unesite ime, prezime, e-mail adresu, korisničko ime i lozinku, adresu, broj telefona, poziciju, radni staž, te naziv prevoznika za koji radnik radi.<br>
Nakon što ste unijeli sve potrebne podatke, kliknite na "Dodaj radnika" kako biste pohranili nove informacije u našu bazu podataka.</p>
<p>Pregled postojećih radnika:<br>
Na stranici se nalazi i tabela sa svim trenutno postojećim radnicima naših firmi za javni prevoz. Tablica prikazuje ime i prezime, e-mail adresu, korisničko ime, adresu, broj telefona, poziciju, radni staž i prevoznika za kojeg radnik radi. Ovdje možete brzo pregledati sve dostupne informacije o našim radnicima.</p>
<p>Uklanjanje radnika:<br>
Ukoliko je neki radnik prestao raditi za naše firme ili je potrebno ukloniti zaposlenika iz baze podataka, kliknite na dugme "Ukloni radnika" uz odgovarajući red u tablici. Ova akcija će trajno ukloniti radnika iz naše baze podataka.</p>
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
