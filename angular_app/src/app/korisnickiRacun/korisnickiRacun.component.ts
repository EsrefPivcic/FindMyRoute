import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MojConfig } from '../moj-config';
import { Router } from '@angular/router';
import { LoginInformacije } from '../_helpers/login-informacije';
import { AutentifikacijaHelper } from '../_helpers/autentifikacija-helper';

@Component({
  selector: 'app-korisnickiRacun',
  templateUrl: 'korisnickiRacun.component.html',
  styleUrls: ['korisnickiRacun.component.css']
})
export class KorisnickiRacunComponent implements OnInit {

  id: number;
  racunPodaci: any;

  constructor(
    private httpKlijent: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  loginInfo(): LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  ngOnInit(): void {
    fetch(MojConfig.adresa_servera+ "/Korisnik/Get/id?id="+this.loginInfo().autentifikacijaToken.korisnickiNalog.id )
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
            this.racunPodaci = x;
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
