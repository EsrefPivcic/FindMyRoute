import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MojConfig } from '../moj-config';
import { Router } from '@angular/router';
import { LoginInformacije } from '../_helpers/login-informacije';
import { AutentifikacijaHelper } from '../_helpers/autentifikacija-helper';

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

const BrojTelefona = /[0-9]{8}/;
const Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-korisnickiRacun',
  templateUrl: 'korisnickiRacun.component.html',
  styleUrls: ['korisnickiRacun.component.css']
})
export class KorisnickiRacunComponent implements OnInit {

  @ViewChild('slikaInput') slikaInputRef!: ElementRef<HTMLInputElement>;
  id: number;
  racunPodaci: any;
  kreditnaPodaci: any;
  promjenaLozinke: boolean = false;
  promjenaPINa: boolean = false;
  promjenaSlike: boolean = false;
  promjenaImena: boolean = false;
  txtNovoIme: string = "";
  promjenaPrezimena: boolean = false;
  txtNovoPrezime: string = "";
  promjenaEmaila: boolean = false;
  txtNoviEmail: string = "";
  promjenaKorisnickog: boolean = false;
  txtNovoKorisnicko: string = "";
  promjenaAdrese: boolean = false;
  txtNovaAdresa: string = "";
  promjenaBroja: boolean = false;
  txtNoviBroj: string = "";
  promjenaPozicije: boolean = false;
  txtNovaPozicija: string = "";
  txtTrenutnaLozinka: string = "";
  txtNovaLozinka: string = "";
  txtNovaPotvrdaLozinka: string = ""
  txtTrenutniPIN: string = "";
  txtNoviPIN: string = "";
  txtNoviPotvrdaPIN: string = ""
  Slika: string = "";
  constructor(
    private httpKlijent: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isKorisnik) {
      this.getKorisnik();
    }
    else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isRadnikFirme) {
      this.getRadnik();
    }
    else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isAdministrator) {
      this.getAdmin();
    }
  }

  getAdmin(): void {
    fetch(MojConfig.adresa_servera+ "/Administrator/Get/id?id="+this.loginInfo().autentifikacijaToken.korisnickiNalog.id )
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
            this.racunPodaci = x;
            this.GetSlika(this.racunPodaci.id);
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  getRadnik(): void {
    fetch(MojConfig.adresa_servera+ "/RadnikFirme/Get/id?id="+this.loginInfo().autentifikacijaToken.korisnickiNalog.id )
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
            this.racunPodaci = x;
            this.GetSlika(this.racunPodaci.id);
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  getKorisnik():void {
    fetch(MojConfig.adresa_servera+ "/Korisnik/Get/id?id="+this.loginInfo().autentifikacijaToken.korisnickiNalog.id )
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
            this.racunPodaci = x;
            this.GetSlika(this.racunPodaci.id);
            if (this.loginInfo().autentifikacijaToken.korisnickiNalog.posjedujeKreditnu) {
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
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  loginInfo(): LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  btnKreditna(kreditna: any): void {
    if (kreditna == 0) {
      this.router.navigate(['/upravljanjeKreditna', 0]);
    }
    else {
      this.router.navigate(['/upravljanjeKreditna', this.kreditnaPodaci.id]);
    }
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
      this.promjenaSlike = true;
    }
  }

  LogOut(): void {
    AutentifikacijaHelper.setLoginInfo(null);
    this.httpKlijent.post(MojConfig.adresa_servera + "/Autentifikacija/Logout/", null, MojConfig.http_opcije())
      .subscribe((x: any) => {
        this.router.navigateByUrl("/pretraga");
        porukaSuccess("Kreditna kartica uspješno uklonjena, potrebno se ponovo ulogirati!");
      });
  }

  btnUkloniKarticu(): void {
    this.httpKlijent.delete(`${MojConfig.adresa_servera}/KreditnaKartica/Delete/${this.kreditnaPodaci.id}`, MojConfig.http_opcije()).subscribe(x=>{
      this.LogOut();
    });
  }

  PromijeniLozinku(): void {
    if (this.Validiraj()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        trenutnaLozinka: this.txtTrenutnaLozinka,
        novaLozinka: this.txtNovaLozinka
      };
      if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isKorisnik) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniLozinku`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Lozinka uspješno promijenjena!");
          this.promjenaLozinke = false;
          this.txtNovaLozinka = "";
          this.txtTrenutnaLozinka = "";
          this.txtNovaPotvrdaLozinka = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isRadnikFirme) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/RadnikFirme/PromijeniLozinku`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Lozinka uspješno promijenjena!");
          this.promjenaLozinke = false;
          this.txtNovaLozinka = "";
          this.txtTrenutnaLozinka = "";
          this.txtNovaPotvrdaLozinka = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isAdministrator) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Administrator/PromijeniLozinku`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Lozinka uspješno promijenjena!");
          this.promjenaLozinke = false;
          this.txtNovaLozinka = "";
          this.txtTrenutnaLozinka = "";
          this.txtNovaPotvrdaLozinka = "";
          this.ngOnInit();
        });
      }
    }
  }

  PromijeniPIN(): void {
    if (this.ValidirajPIN()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        trenutnaLozinka: this.txtTrenutniPIN,
        novaLozinka: this.txtNoviPIN
      };
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Administrator/PromijeniPIN`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("PIN uspješno promijenjen!");
          this.promjenaPINa = false;
          this.txtNoviPIN = "";
          this.txtTrenutniPIN = "";
          this.txtNoviPotvrdaPIN = "";
          this.ngOnInit();
        });
    }
  }

  PromijeniSliku(): void {
    if (this.promjenaSlike == true) {
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        novaSlika: this.Slika
      }
      if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isKorisnik) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniSliku`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Slika uspješno promijenjena!");
          this.GetSlika(this.racunPodaci.id);
          this.ngOnInit();
          this.slikaInputRef.nativeElement.value = '';
          this.promjenaSlike = false;
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isRadnikFirme) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/RadnikFirme/PromijeniSliku`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Slika uspješno promijenjena!");
          this.GetSlika(this.racunPodaci.id);
          this.ngOnInit();
          this.slikaInputRef.nativeElement.value = '';
          this.promjenaSlike = false;
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isAdministrator) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Administrator/PromijeniSliku`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Slika uspješno promijenjena!");
          this.GetSlika(this.racunPodaci.id);
          this.ngOnInit();
          this.slikaInputRef.nativeElement.value = '';
          this.promjenaSlike = false;
        });
      }
    }
    else {
      porukaError("Niste odabrali novu sliku!");
    }
  }

  PromijeniIme(): void {
    if (this.ValidirajIme()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        novoIme: this.txtNovoIme
      };
      if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isKorisnik) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniIme`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Ime uspješno promijenjeno!");
          this.promjenaImena = false;
          this.txtNovoIme = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isRadnikFirme) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/RadnikFirme/PromijeniIme`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Ime uspješno promijenjeno!");
          this.promjenaImena = false;
          this.txtNovoIme = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isAdministrator) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Administrator/PromijeniIme`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Ime uspješno promijenjeno!");
          this.promjenaImena = false;
          this.txtNovoIme = "";
          this.ngOnInit();
        });
      }
    }
  }

  PromijeniPrezime(): void {
    if (this.ValidirajPrezime()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        novoPrezime: this.txtNovoPrezime
      };
      if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isKorisnik) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniPrezime`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Prezime uspješno promijenjeno!");
          this.promjenaPrezimena = false;
          this.txtNovoPrezime = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isRadnikFirme) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/RadnikFirme/PromijeniPrezime`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Prezime uspješno promijenjeno!");
          this.promjenaPrezimena = false;
          this.txtNovoPrezime = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isAdministrator) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Administrator/PromijeniPrezime`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Prezime uspješno promijenjeno!");
          this.promjenaPrezimena = false;
          this.txtNovoPrezime = "";
          this.ngOnInit();
        });
      }
    }
  }

  PromijeniEmail(): void {
    if (this.ValidirajEmail()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        noviEmail: this.txtNoviEmail
      };
      if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isKorisnik) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniEmail`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Email uspješno promijenjen!");
          this.promjenaEmaila = false;
          this.txtNoviEmail = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isRadnikFirme) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/RadnikFirme/PromijeniEmail`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Email uspješno promijenjen!");
          this.promjenaEmaila = false;
          this.txtNoviEmail = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isAdministrator) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Administrator/PromijeniEmail`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Email uspješno promijenjen!");
          this.promjenaEmaila = false;
          this.txtNoviEmail = "";
          this.ngOnInit();
        });
      }
    }
  }

  PromijeniKorisnickoIme(): void {
    if (this.ValidirajKorisnickoIme()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        novoKorisnickoIme: this.txtNovoKorisnicko
      };
      if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isKorisnik) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniKorisnickoIme`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Korisničko ime uspješno promijenjeno!");
          this.promjenaKorisnickog = false;
          this.txtNovoKorisnicko = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isRadnikFirme) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/RadnikFirme/PromijeniKorisnickoIme`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Korisničko ime uspješno promijenjeno!");
          this.promjenaKorisnickog = false;
          this.txtNovoKorisnicko = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isAdministrator) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Administrator/PromijeniKorisnickoIme`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Korisničko ime uspješno promijenjeno!");
          this.promjenaKorisnickog = false;
          this.txtNovoKorisnicko = "";
          this.ngOnInit();
        });
      }
    }
  }

  PromijeniAdresu(): void {
    if (this.ValidirajAdresu()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        novaAdresa: this.txtNovaAdresa
      };
      if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isKorisnik) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniAdresu`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Adresa uspješno promijenjena!");
          this.promjenaAdrese = false;
          this.txtNovaAdresa = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isRadnikFirme) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/RadnikFirme/PromijeniAdresu`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Adresa uspješno promijenjena!");
          this.promjenaAdrese = false;
          this.txtNovaAdresa = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isAdministrator) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Administrator/PromijeniAdresu`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Adresa uspješno promijenjena!");
          this.promjenaAdrese = false;
          this.txtNovaAdresa = "";
          this.ngOnInit();
        });
      }
    }
  }

  PromijeniBrojTelefona(): void {
    if (this.ValidirajBrojTelefona()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        noviBrojTelefona: "+387"+this.txtNoviBroj
      };
      if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isKorisnik) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniBroj`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Broj telefona uspješno promijenjen!");
          this.promjenaBroja = false;
          this.txtNoviBroj = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isRadnikFirme) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/RadnikFirme/PromijeniBroj`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Broj telefona uspješno promijenjen!");
          this.promjenaBroja = false;
          this.txtNoviBroj = "";
          this.ngOnInit();
        });
      }
      else if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isAdministrator) {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Administrator/PromijeniBroj`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Broj telefona uspješno promijenjen!");
          this.promjenaBroja = false;
          this.txtNoviBroj = "";
          this.ngOnInit();
        });
      }
    }
  }

  PromijeniPoziciju(): void {
    if (this.ValidirajNovuPoziciju()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        novaPozicija: this.txtNovaPozicija
      };
        this.httpKlijent.post(`${MojConfig.adresa_servera}/RadnikFirme/PromijeniPoziciju`, podaci, MojConfig.http_opcije()).subscribe(x=>{
          porukaSuccess("Pozicija u firmi uspješno promijenjena!");
          this.promjenaPozicije = false;
          this.txtNovaPozicija = "";
          this.ngOnInit();
        });
    }
  }

  Validiraj(): boolean {
    if (this.txtTrenutnaLozinka == "" || this.txtNovaLozinka == "" || this.txtNovaPotvrdaLozinka == ""){
      porukaError("Sva polja su obavezna!")
      return false;
    }
    if (this.txtNovaLozinka != this.txtNovaPotvrdaLozinka) {
      porukaError("Lozinke se ne poklapaju!")
      return false;
    }
    return true;
  }

  ValidirajPIN(): boolean {
    if (this.txtTrenutniPIN == "" || this.txtNoviPIN == "" || this.txtNoviPotvrdaPIN == ""){
      porukaError("Sva polja su obavezna!")
      return false;
    }
    if (this.txtNoviPIN != this.txtNoviPotvrdaPIN) {
      porukaError("Lozinke se ne poklapaju!")
      return false;
    }
    return true;
  }

  ValidirajIme(): boolean {
    if (this.txtNovoIme == ""){
      porukaError("Polje je obavezno!")
      return false;
    }
    return true;
  }

  ValidirajNovuPoziciju(): boolean {
    if (this.txtNovaPozicija == ""){
      porukaError("Polje je obavezno!")
      return false;
    }
    return true;
  }

  ValidirajPrezime(): boolean {
    if (this.txtNovoPrezime == ""){
      porukaError("Polje je obavezno!")
      return false;
    }
    return true;
  }

  ValidirajEmail(): boolean {
    if (this.txtNoviEmail == ""){
      porukaError("Polje je obavezno!")
      return false;
    }
    if (!this.txtNoviEmail.match(Email)) {
      porukaError("Molimo unesite ispravan email!");
      return false;
    }
    return true;
  }

  ValidirajKorisnickoIme(): boolean {
    if (this.txtNovoKorisnicko == ""){
      porukaError("Polje je obavezno!")
      return false;
    }
    return true;
  }

  ValidirajAdresu(): boolean {
    if (this.txtNovaAdresa == ""){
      porukaError("Polje je obavezno!")
      return false;
    }
    return true;
  }

  ValidirajBrojTelefona(): boolean {
    if (this.txtNoviBroj == ""){
      porukaError("Polje je obavezno!")
      return false;
    }
    if (!this.txtNoviBroj.match(BrojTelefona)) {
      porukaError("Molimo unesite ispravan broj telefona!");
      return false;
    }
    return true;
  }

  GetSlika(id: number): void {
    const uniqueParam = new Date().getTime();
    if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isKorisnik) {
      this.Slika = `${MojConfig.adresa_servera}/Korisnik/GetSlikaDB/${id}?v=${uniqueParam}`;
    }
    if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isRadnikFirme) {
      this.Slika = `${MojConfig.adresa_servera}/RadnikFirme/GetSlikaDB/${id}?v=${uniqueParam}`;
    }
    if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isAdministrator) {
      this.Slika = `${MojConfig.adresa_servera}/Administrator/GetSlikaDB/${id}?v=${uniqueParam}`;
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
    <p>Na ovoj stranici su prikazani detalji Vašeg korisničkog profila.</p>
    <p>Vaša trenutna fotografija profila nalazi se na vrhu stranice. Kliknite na "Choose File" ispod kako biste ažurirali Vašu fotografiju. Nakon odabira fotografije, kliknite na "Sačuvaj sliku", kako biste spasili promjene.</p>
    <p>Klikom na "Uredi" pored svakog polja možete promijeniti navedene osobne podatke.</p>
    <p>Klikom na "Poveži" možete dodati novu kreditnu karticu. U slučaju da je kreditna kartica već dodana, klikom na dugme "Uredi" možete izmijeniti podatke kreditne kartice, te klikom na dugme "Ukloni" možete ukloniti kreditnu karticu povezanu sa Vašim korisničkim nalogom.</p>
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
