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
}
