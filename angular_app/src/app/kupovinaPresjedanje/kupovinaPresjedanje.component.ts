import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {LoginInformacije} from "../_helpers/login-informacije";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";
import {getLocaleDateTimeFormat, getLocaleDayNames} from "@angular/common";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

@Component({
  selector: 'app-kupovinaPresjedanje',
  templateUrl: './kupovinaPresjedanje.component.html',
  styleUrls: ['./kupovinaPresjedanje.component.html']
})
export class KupovinaPresjedanjeComponent implements OnInit {

  title: string = 'FindMyRoute - Kupovina';
  linija1_id : number;
  linija2_id : number;
  linijaPodaci1 : any;
  linijaPodaci2 : any;
  txtKolicina: any = 1;
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.linija1_id = +params['id1']; // (+) converts string 'id' to a number
    });
    this.route.params.subscribe(params => {
      this.linija2_id = +params['id2']; // (+) converts string 'id' to a number
    });
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
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
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
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  btnKupi(): void {
    let kupovina1 = {
      linija_id: this.linija1_id,
      korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
      kolicina: this.txtKolicina };
    let kupovina2 = {
      linija_id: this.linija2_id,
      korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
      kolicina: this.txtKolicina };
    this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/Add`, kupovina1, MojConfig.http_opcije()).subscribe(x => {
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/Add`, kupovina2, MojConfig.http_opcije()).subscribe(x => {
        this.router.navigate(['/pretraga']);
        porukaSuccess("Kupovina uspješna!")
      });
    });
  }
}

