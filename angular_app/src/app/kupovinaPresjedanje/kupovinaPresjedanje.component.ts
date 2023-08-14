import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {LoginInformacije} from "../_helpers/login-informacije";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

const Broj = /^\d+$/;
const Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-kupovinaPresjedanje',
  templateUrl: './kupovinaPresjedanje.component.html',
  styleUrls: ['./kupovinaPresjedanje.component.css']
})
export class KupovinaPresjedanjeComponent implements OnInit {

  title: string = 'FindMyRoute - Kupovina';
  linija1_id : number;
  linija2_id : number;
  linijaPodaci1 : any;
  linijaPodaci2 : any;
  txtKolicina: any = 1;
  daniVoznje: number[] = [];
  isInvalidDate = false;
  datumVoznje: string = '';
  txtNacinPlacanja: string = "";
  kreditnaPodaci: any;
  txtTip: string = "";
  txtBroj1: string = "";
  txtBroj2: string = "";
  txtBroj3: string = "";
  txtBroj4: string = "";
  txtDatum1: string = "";
  txtDatum2: string = "";
  txtSigBroj: string = "";
  txtSigBrojPotvrdi: string = "";
  txtPayPalMail: string = "";
  prevoznikLogo1: string = "";
  prevoznikLogo2: string = "";
  presjedanje: boolean = true;
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.linija1_id = +params['id1'];
    });
    this.route.params.subscribe(params => {
      this.linija2_id = +params['id2'];
    });
    this.GetLinije();
    if (this.loginInfo().autentifikacijaToken.korisnickiNalog.posjedujeKreditnu) {
      this.GetKreditna();
    }
  }

  GetKreditna(): void {
    fetch(MojConfig.adresa_servera+ "/KreditnaKartica/GetByKorisnik/korisnikId?korisnikId="+this.loginInfo().autentifikacijaToken.korisnickiNalog.id )
      .then(
        r=> {
          if (r.status != 200) {
            if (r.status == 400) {
              alert("Nepoznat korisnik!");
            }
            else {
              alert("greska" + r.status);
            }
            return;
          }
          r.json().then(x=>{
            this.kreditnaPodaci = x;
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  GetLinije(): void {
    fetch(MojConfig.adresa_servera+ "/Linija/Get/id?id="+this.linija1_id)
      .then(
        r=> {
          if (r.status != 200) {
            if (r.status == 400) {
              alert("Nepoznata linija!");
            }
            else {
              alert("greska" + r.status);
            }
            return;
          }
          r.json().then(x=>{
            this.linijaPodaci1 = x;
            const uniqueParam = new Date().getTime();
            this.prevoznikLogo1 = `${MojConfig.adresa_servera}/Prevoznik/GetSlikaDB/${this.linijaPodaci1.prevoznik.id}?v=${uniqueParam}`;
            fetch(MojConfig.adresa_servera+ "/Linija/Get/id?id="+this.linija2_id)
              .then(
                r=> {
                  if (r.status != 200) {
                    if (r.status == 400) {
                      alert("Nepoznata linija!");
                    }
                    else {
                      alert("greska" + r.status);
                    }
                    return;
                  }
                  r.json().then(x=>{
                    this.linijaPodaci2 = x;
                    const uniqueParam = new Date().getTime();
                    this.prevoznikLogo2 = `${MojConfig.adresa_servera}/Prevoznik/GetSlikaDB/${this.linijaPodaci2.prevoznik.id}?v=${uniqueParam}`;
                    this.DodajDaneVoznje();
                  });
                }
              )
              .catch(
                err=>{
                  alert("greska" + err);
                }
              )
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

  Prevoznik(id: number): void {
    this.router.navigate(['/prevoznik', id]);
  }

  onDateSelection(selectedDate: string) {
    const date = new Date(selectedDate);
    if (!this.ProvjeriDan(date)) {
      this.isInvalidDate = true;
      const dateInput = document.getElementById('datum') as HTMLInputElement;
      dateInput.value = '';
      this.datumVoznje = '';
    }
    else {
      this.isInvalidDate = false;
      this.datumVoznje = selectedDate;
      console.log(this.datumVoznje);
    }
  }

  ProvjeriDan(datum: Date): boolean {
    const dan = datum.getDay();
    const danas = new Date();
    if (this.daniVoznje.includes(dan) && datum >= danas) {
      return true;
    }
    return false;
  }

  DodajDaneVoznje(): void {
    if (this.linijaPodaci1.daniVoznje.ponedjeljak == true && this.linijaPodaci2.daniVoznje.ponedjeljak == true) {
      this.daniVoznje.push(1);
    }
    if (this.linijaPodaci1.daniVoznje.utorak == true && this.linijaPodaci2.daniVoznje.utorak == true) {
      this.daniVoznje.push(2);
    }
    if (this.linijaPodaci1.daniVoznje.srijeda == true && this.linijaPodaci2.daniVoznje.srijeda == true) {
      this.daniVoznje.push(3);
    }
    if (this.linijaPodaci1.daniVoznje.cetvrtak == true && this.linijaPodaci2.daniVoznje.cetvrtak == true) {
      this.daniVoznje.push(4);
    }
    if (this.linijaPodaci1.daniVoznje.petak == true && this.linijaPodaci2.daniVoznje.petak == true) {
      this.daniVoznje.push(5);
    }
    if (this.linijaPodaci1.daniVoznje.subota == true && this.linijaPodaci2.daniVoznje.subota == true) {
      this.daniVoznje.push(6);
    }
    if (this.linijaPodaci1.daniVoznje.nedjelja == true && this.linijaPodaci2.daniVoznje.nedjelja == true) {
      this.daniVoznje.push(0);
    }
  }

  Validiraj(): boolean {
    if (this.datumVoznje == '') {
      porukaError("Molimo odaberite datum vožnje!");
      return false;
    }
    if (this.txtSigBrojPotvrdi == "") {
      porukaError("Molimo unesite sigurnosni broj vaše povezane kreditne kartice!");
      return false;
    }
    return true;
  }

  ValidirajPayPal(): boolean {
    if (this.txtPayPalMail == "")
    {
      porukaError("Molimo unesite email adresu!");
    }
    if (!this.txtPayPalMail.match(Email)) {
      porukaError("Molimo unesite ispravnu email adresu!");
      return false;
    }
    if (this.datumVoznje == '') {
      porukaError("Molimo odaberite datum vožnje!");
      return false;
    }
    return true;
  }

  ValidirajNovaKartica(): boolean {
    if (this.txtTip == "" || this.txtBroj1 == "" || this.txtBroj2 == "" || this.txtBroj3 == "" || this.txtBroj4 == ""
      || this.txtDatum1 == "" || this.txtDatum2 == "" || this.txtSigBroj == "") {
      porukaError("Sva polja su obavezna!");
      return false;
    }
    if (!this.txtBroj1.match(Broj) || !this.txtBroj2.match(Broj) || !this.txtBroj3.match(Broj) || !this.txtBroj4.match(Broj)
      || !this.txtDatum1.match(Broj) || !this.txtDatum2.match(Broj) || !this.txtSigBroj.match(Broj)) {
      porukaError("Molimo unesite podatke u brojevnom obliku!");
      return false;
    }
    if (this.datumVoznje == '') {
      porukaError("Molimo odaberite datum vožnje!");
      return false;
    }
    return true;
  }

  LogOut(): void {
    AutentifikacijaHelper.setLoginInfo(null);
    this.httpKlijent.post(MojConfig.adresa_servera + "/Autentifikacija/Logout/", null, MojConfig.http_opcije())
      .subscribe((x: any) => {
        this.router.navigateByUrl("/pretraga");
        porukaSuccess("Kreditna kartica uspješno dodana, potrebno se ponovo ulogirati!");
      });
  }

  btnPlatiPovezanom(): void {
    if (this.Validiraj()) {
      let kupovina1 = {
        linija_id: this.linija1_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kreditna_id: this.kreditnaPodaci.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
        sigurnosniBroj: this.txtSigBrojPotvrdi,
        presjedanje: this.presjedanje
      };
      let kupovina2 = {
        linija_id: this.linija2_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kreditna_id: this.kreditnaPodaci.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
        sigurnosniBroj: this.txtSigBrojPotvrdi,
        presjedanje: this.presjedanje
      };
      let mailInfo = {
        linija1_id: this.linija1_id,
        linija2_id: this.linija2_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kreditna_id: this.kreditnaPodaci.id,
        tipKartice: "",
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
        payPalEmail: ""
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/Plati`, kupovina1, MojConfig.http_opcije()).subscribe(x => {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/Plati`, kupovina2, MojConfig.http_opcije()).subscribe(x => {
          this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/PresjedanjeEmail`, mailInfo, MojConfig.http_opcije()).subscribe(x => {
            this.router.navigate(['/pretraga']);
            porukaSuccess("Kupovina uspješna!")
          });
        });
      });
    }
  }

  btnPlatiPayPal(): void {
    if (this.ValidirajPayPal()) {
      let kupovina1 = {
        linija_id: this.linija1_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
        payPalEmail: this.txtPayPalMail,
        presjedanje: this.presjedanje
      };
      let kupovina2 = {
        linija_id: this.linija2_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
        payPalEmail: this.txtPayPalMail,
        presjedanje: this.presjedanje
      };
      let mailInfo = {
        linija1_id: this.linija1_id,
        linija2_id: this.linija2_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
        payPalEmail: this.txtPayPalMail
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/PlatiPayPal`, kupovina1, MojConfig.http_opcije()).subscribe(x => {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/PlatiPayPal`, kupovina2, MojConfig.http_opcije()).subscribe(x => {
          this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/PresjedanjeEmail`, mailInfo, MojConfig.http_opcije()).subscribe(x => {
            this.router.navigate(['/pretraga']);
            porukaSuccess("Kupovina uspješna!")
          });
        });
      });
    }
  }

  btnPlatiNovom(spremiKarticu: boolean): void{
    if (this.ValidirajNovaKartica()) {
      let kupovina1 = {
        linija_id: this.linija1_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
        tipKartice: this.txtTip,
        brojKartice: this.txtBroj1 +"-"+ this.txtBroj2 +"-"+ this.txtBroj3 +"-"+ this.txtBroj4,
        datumIsteka: this.txtDatum1 +"/"+ this.txtDatum2,
        sigurnosniBroj: this.txtSigBroj,
        poveziKarticu: spremiKarticu,
        presjedanje: this.presjedanje
      };
      let kupovina2 = {
        linija_id: this.linija2_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
        tipKartice: this.txtTip,
        brojKartice: this.txtBroj1 +"-"+ this.txtBroj2 +"-"+ this.txtBroj3 +"-"+ this.txtBroj4,
        datumIsteka: this.txtDatum1 +"/"+ this.txtDatum2,
        sigurnosniBroj: this.txtSigBroj,
        poveziKarticu: spremiKarticu,
        presjedanje: this.presjedanje
      };
      let mailInfo = {
        linija1_id: this.linija1_id,
        linija2_id: this.linija2_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        tipKartice: this.txtTip,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/PlatiNovomKarticom`, kupovina1, MojConfig.http_opcije()).subscribe(x => {
        if (spremiKarticu) {
          this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/PlatiPresjedanje`, kupovina2, MojConfig.http_opcije()).subscribe(x => {
            this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/PresjedanjeEmail`, mailInfo, MojConfig.http_opcije()).subscribe(x => {
              porukaSuccess("Kupovina uspješna!");
              this.LogOut();
            });
          });
        }
        else {
          this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/PlatiNovomKarticom`, kupovina2, MojConfig.http_opcije()).subscribe(x => {
            this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/PresjedanjeEmail`, mailInfo, MojConfig.http_opcije()).subscribe(x => {
              this.router.navigate(['/pretraga']);
              porukaSuccess("Kupovina uspješna!")
            });
          });
        }
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
    <p>Uz nekoliko koraka, na ovoj stranici možete kupiti svoje karte i osigurati ugodno putovanje.</p>
<p>Odabir datuma vožnje:<br>
Na ovoj stranici, vidjet ćete "Datepicker" s kalendarom na kojem možete odabrati željeni datum putovanja. Kliknite na datum koji Vam odgovara i nastavite dalje.</p>
<p>Odabir broja karata:<br>
Unesite željeni broj karata koje želite kupiti za odabrani datum i vožnju.</p>
<p>Odabir načina plaćanja:<br>
a) Plaćanje putem kreditne kartice:<br>
Unesite tip kartice (npr. Visa, Mastercard, American Express).<br>
Unesite broj kartice koji se sastoji od 16 znamenaka.<br>
Unesite datum isteka kartice (mjesec i godina).<br>
Unesite sigurnosni broj kartice koji se nalazi na poleđini kartice (obično trocifreni broj).<br>
Nakon što unesete tražene podatke, imat ćete opciju samo plaćanja karticom ili plaćanja i povezivanja kartice sa svojim korisničkim profilom, što će olakšati buduće rezervacije.</p>
<p>b) Plaćanje putem PayPal-a:<br>
Unesite Vašu registriranu e-mail adresu povezanu s Vašim PayPal računom.</p>
<p>Završetak narudžbe:<br>
Nakon što unesete tražene podatke za plaćanje, kliknite na "Plati" kako biste završili postupak kupovine. Nakon uspješne transakcije, dobit ćete potvrdu o kupovini i svoje karte putem e-maila.</p>

    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
        <button id="closeBtn" style="margin-top: 10px; padding: 10px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Zatvori</button>
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
