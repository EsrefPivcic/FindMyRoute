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
  txtTrenutnaLozinka: string = "";
  txtNovaLozinka: string = "";
  txtNovaPotvrdaLozinka: string = ""
  Slika: string = "";
  constructor(
    private httpKlijent: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
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
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniLozinku`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Lozinka uspješno promijenjena!");
        this.promjenaLozinke = false;
        this.txtNovaLozinka = "";
        this.txtTrenutnaLozinka = "";
        this.txtNovaPotvrdaLozinka = "";
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
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniSliku`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Slika uspješno promijenjena!");
        this.GetSlika(this.racunPodaci.id);
        this.ngOnInit();
        this.slikaInputRef.nativeElement.value = '';
        this.promjenaSlike = false;
      });
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
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniIme`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Ime uspješno promijenjeno!");
        this.promjenaImena = false;
        this.ngOnInit();
      });
    }
  }

  PromijeniPrezime(): void {
    if (this.ValidirajPrezime()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        novoPrezime: this.txtNovoPrezime
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniPrezime`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Prezime uspješno promijenjeno!");
        this.promjenaPrezimena = false;
        this.ngOnInit();
      });
    }
  }

  PromijeniEmail(): void {
    if (this.ValidirajEmail()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        noviEmail: this.txtNoviEmail
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniEmail`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Email uspješno promijenjen!");
        this.promjenaEmaila = false;
        this.ngOnInit();
      });
    }
  }

  PromijeniKorisnickoIme(): void {
    if (this.ValidirajKorisnickoIme()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        novoKorisnickoIme: this.txtNovoKorisnicko
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniKorisnickoIme`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Korisničko ime uspješno promijenjeno!");
        this.promjenaKorisnickog = false;
        this.ngOnInit();
      });
    }
  }

  PromijeniAdresu(): void {
    if (this.ValidirajAdresu()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        novaAdresa: this.txtNovaAdresa
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniAdresu`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Adresa uspješno promijenjena!");
        this.promjenaAdrese = false;
        this.ngOnInit();
      });
    }
  }

  PromijeniBrojTelefona(): void {
    if (this.ValidirajBrojTelefona()){
      let podaci = {
        id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        noviBrojTelefona: "+387"+this.txtNoviBroj
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Korisnik/PromijeniBroj`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Broj telefona uspješno promijenjen!");
        this.promjenaBroja = false;
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

  ValidirajIme(): boolean {
    if (this.txtNovoIme == ""){
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
    this.Slika = `${MojConfig.adresa_servera}/Korisnik/GetSlikaDB/${id}?v=${uniqueParam}`;
  }
}
