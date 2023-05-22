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
  daniVoznje: number[] = [];
  isInvalidDate = false;
  datumVoznje: string = '';
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
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

  Validiraj(): boolean {
    if (this.datumVoznje == '') {
      return false;
    }
    return true;
  }

  btnKupi(): void {
    if (this.Validiraj()) {
      let kupovina1 = {
        linija_id: this.linija1_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje };
      let kupovina2 = {
        linija_id: this.linija2_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/Add`, kupovina1, MojConfig.http_opcije()).subscribe(x => {
        this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/Add`, kupovina2, MojConfig.http_opcije()).subscribe(x => {
          this.router.navigate(['/pretraga']);
          porukaSuccess("Kupovina uspješna!")
        });
      });
    }
    else {
      porukaError("Molimo odaberite datum vožnje!");
    }
  }
}

