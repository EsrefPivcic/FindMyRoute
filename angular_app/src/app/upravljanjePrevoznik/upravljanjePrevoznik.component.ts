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
  selector: 'app-upravljanjePrevoznik',
  templateUrl: 'upravljanjePrevoznik.component.html',
  styleUrls: ['upravljanjePrevoznik.component.css']
})
export class UpravljanjePrevoznikComponent implements OnInit {

  @ViewChild('slikaInput') slikaInputRef!: ElementRef<HTMLInputElement>;
  id: number;
  prevoznikPodaci: any;
  promjenaSlike: boolean = false;
  promjenaNaziva: boolean = false;
  txtNoviNaziv: string = "";
  promjenaEmaila: boolean = false;
  txtNoviEmail: string = "";
  promjenaAdrese: boolean = false;
  txtNovaAdresa: string = "";
  promjenaBroja: boolean = false;
  txtNoviBroj: string = "";
  Logo: string = "";
  constructor(
    private httpKlijent: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    fetch(MojConfig.adresa_servera+ "/Prevoznik/GetByRadnik/radnikId?radnikId="+this.loginInfo().autentifikacijaToken.korisnickiNalog.id )
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
            this.prevoznikPodaci = x;
            this.GetLogo(this.prevoznikPodaci.id);
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

  Preview() {
    // @ts-ignore
    var file = document.getElementById("slika-input").files[0];
    if (file) {
      var reader = new FileReader();
      let this2=this;
      reader.onload = function () {
        this2.Logo = reader.result?.toString();
      }
      reader.readAsDataURL(file);
      this.promjenaSlike = true;
    }
  }

  PromijeniLogo(): void {
    if (this.promjenaSlike == true) {
      let podaci = {
        id: this.prevoznikPodaci.id,
        novaSlika: this.Logo
      }
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Prevoznik/PromijeniSliku`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Slika uspješno promijenjena!");
        this.GetLogo(this.prevoznikPodaci.id);
        this.ngOnInit();
        this.slikaInputRef.nativeElement.value = '';
        this.promjenaSlike = false;
      });
    }
    else {
      porukaError("Niste odabrali novu sliku!");
    }
  }

  PromijeniNaziv(): void {
    if (this.ValidirajIme()){
      let podaci = {
        id: this.prevoznikPodaci.id,
        noviNaziv: this.txtNoviNaziv
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Prevoznik/PromijeniNaziv`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Naziv uspješno promijenjen!");
        this.promjenaNaziva = false;
        this.txtNoviNaziv = "";
        this.ngOnInit();
      });
    }
  }

  PromijeniEmail(): void {
    if (this.ValidirajEmail()){
      let podaci = {
        id: this.prevoznikPodaci.id,
        noviEmail: this.txtNoviEmail
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Prevoznik/PromijeniEmail`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Email uspješno promijenjen!");
        this.promjenaEmaila = false;
        this.txtNoviEmail = "";
        this.ngOnInit();
      });
    }
  }

  PromijeniAdresu(): void {
    if (this.ValidirajAdresu()){
      let podaci = {
        id: this.prevoznikPodaci.id,
        novaAdresa: this.txtNovaAdresa
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Prevoznik/PromijeniAdresu`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Adresa uspješno promijenjena!");
        this.promjenaAdrese = false;
        this.txtNovaAdresa = "";
        this.ngOnInit();
      });
    }
  }

  PromijeniBrojTelefona(): void {
    if (this.ValidirajBrojTelefona()){
      let podaci = {
        id: this.prevoznikPodaci.id,
        noviBrojTelefona: "+387"+this.txtNoviBroj
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Prevoznik/PromijeniBroj`, podaci, MojConfig.http_opcije()).subscribe(x=>{
        porukaSuccess("Broj telefona uspješno promijenjen!");
        this.promjenaBroja = false;
        this.txtNoviBroj = "";
        this.ngOnInit();
      });
    }
  }

  ValidirajIme(): boolean {
    if (this.txtNoviNaziv == ""){
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

  GetLogo(id: number): void {
    const uniqueParam = new Date().getTime(); // Generate a unique timestamp
    this.Logo = `${MojConfig.adresa_servera}/Prevoznik/GetSlikaDB/${id}?v=${uniqueParam}`;
  }
}
