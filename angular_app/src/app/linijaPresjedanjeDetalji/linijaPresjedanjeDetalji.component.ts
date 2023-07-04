import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {LoginInformacije} from "../_helpers/login-informacije";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";

@Component({
  selector: 'app-linijaPresjedanjeDetalji',
  templateUrl: './linijaPresjedanjeDetalji.component.html',
  styleUrls: ['./linijaPresjedanjeDetalji.component.css']
})
export class linijaPresjedanjeDetaljiComponent implements OnInit {

  title: string = 'FindMyRoute - Detalji presjedanja';
  id1 : number;
  id2 : number;
  cekanjePresjedanja : number;
  linijaPodaci1 : any;
  linijaPodaci2 : any;
  prevoznikLogo1: string;
  prevoznikLogo2: string;
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  btnKupovina(): void {
    this.router.navigate(['/kupovinaPresjedanje', this.linijaPodaci1.id, this.linijaPodaci2.id]);
  }

  ngOnInit(): void {
    //preuzima ID linije iz URL query parametra
    this.route.params.subscribe(params => {
      this.id1 = +params['id1']; // (+) converts string 'id' to a number
    });
    this.route.params.subscribe(params => {
      this.id2 = +params['id2']; // (+) converts string 'id' to a number
    });
    this.route.params.subscribe(params => {
      this.cekanjePresjedanja = +params['cekanje']; // (+) converts string 'id' to a number
    });
    this.GetLinija1();
    this.GetLinija2();
  }
  GetLinija1(): void {
    fetch(MojConfig.adresa_servera+ "/Linija/Get/id?id="+this.id1)
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
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  GetLinija2(): void {
    fetch(MojConfig.adresa_servera+ "/Linija/Get/id?id="+this.id2)
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
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  Prevoznik(id: number): void {
    this.router.navigate(['/prevoznik', id]);
  }
}

