import { Component, OnInit } from '@angular/core';
import {MojConfig} from "../moj-config";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

const BrojTelefona = /[0-9]{8}/;
const Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent implements OnInit {
  txtIme: any;
  txtPrezime: any;
  txtEmail: any;
  txtKorisnickoImeReg: any;
  txtLozinkaReg: any;
  txtAdresa: any;
  txtBrojTelefona: any;

  constructor(private httpKlijent: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  Validiraj(): boolean {
    if (this.txtIme == null || this.txtPrezime == null || this.txtEmail == null || this.txtKorisnickoImeReg == null || this.txtLozinkaReg == null
    || this.txtAdresa == null || this.txtBrojTelefona == null) {
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

  btnLogin() {
    if (this.Validiraj()) {
      let saljemo = {
        ime: this.txtIme,
        prezime: this.txtPrezime,
        email: this.txtEmail,
        korisnickoIme: this.txtKorisnickoImeReg,
        lozinka: this.txtLozinkaReg,
        adresa: this.txtAdresa,
        brojTelefona: "+387" + this.txtBrojTelefona
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/Add`, saljemo, MojConfig.http_opcije()).subscribe(x=>{
        this.router.navigateByUrl("/login");
        porukaSuccess("Korisnički račun je uspješno kreiran!")
      });
    }
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
<p>Registracija je brza i jednostavna, a nakon što je završite, dobit ćete pristup svim našim uslugama i mogućnostima. Slijedite korake u nastavku kako biste se uspješno registrirali.</p>
<p>Korak 1: Unesite osobne podatke<br>
Molimo unesite sljedeće osobne podatke kako bismo Vas mogli prepoznati i pružiti Vam personalizirano iskustvo:<br>
Ime: Unesite svoje ime.<br>
Prezime: Unesite svoje prezime.<br>
Email: Unesite važeću email adresu.</p>
<p>Korak 2: Kreirajte korisničko ime i lozinku<br>
Odaberite korisničko ime i lozinku koje ćete koristiti za pristup vašem računu. Korisničko ime mora biti jedinstveno, a lozinka treba biti sigurna.</p>
<p>Korak 3: Unesite adresu i broj telefona<br>
Unesite Vašu adresu i broj telefona kako bismo imali potrebne informacije za komunikaciju s Vama u slučaju potrebe.</p>
<p>Korak 4: Završetak registracije<br>
Kada ste unijeli sve potrebne podatke, pregledajte ih kako biste bili sigurni da su ispravni. Kliknite na "Registriraj se" dugme kako biste završili postupak registracije.</p>
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
