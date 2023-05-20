import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {LoginInformacije} from "../_helpers/login-informacije";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

@Component({
  selector: 'app-kupovina',
  templateUrl: './kupovina.component.html',
  styleUrls: ['./kupovina.component.css']
})
export class KupovinaComponent implements OnInit {

  title: string = 'FindMyRoute - Detalji linije';
  linija_id : number;
  linijaPodaci : any;
  txtKolicina: any = 1;
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.linija_id = +params['id']; // (+) converts string 'id' to a number
    });
    fetch(MojConfig.adresa_servera+ "/Linija/Get/id?id="+this.linija_id)
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
            this.linijaPodaci = x;
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
    let saljemo = {
      linija_id: this.linija_id,
      korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
      kolicina: this.txtKolicina };

    this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/Add`, saljemo, MojConfig.http_opcije()).subscribe(x => {
      this.router.navigate(['/pretraga']);
      porukaSuccess("Kupovina uspješna!")
    });
  }
}

