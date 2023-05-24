import { Component, OnInit } from '@angular/core';
import {MojConfig} from "../moj-config";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";
import {LoginInformacije} from "../_helpers/login-informacije";
import {escapeRegExp} from "@angular/compiler/src/util";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

const BrojTelefona = /[0-9]{8}/;
const BrojTelefonaRegex = new RegExp('BrojTelefona');
const Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const EmailRegex = new RegExp('Email');

@Component({
  selector: 'app-upravljanjeKreditna',
  templateUrl: './upravljanjeKreditna.component.html',
  styleUrls: ['./upravljanjeKreditna.component.css']
})
export class UpravljanjeKreditnaComponent implements OnInit {
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

}
