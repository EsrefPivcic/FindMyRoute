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
  styleUrls: ['./kupovina.component.css'],
})

export class KupovinaComponent implements OnInit {

  title: string = 'FindMyRoute - Kupovina';
  linija_id : number;
  linijaPodaci : any;
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
    if (this.linijaPodaci.daniVoznje.ponedjeljak == true) {
      this.daniVoznje.push(1);
    }
    if (this.linijaPodaci.daniVoznje.utorak == true) {
      this.daniVoznje.push(2);
    }
    if (this.linijaPodaci.daniVoznje.srijeda == true) {
      this.daniVoznje.push(3);
    }
    if (this.linijaPodaci.daniVoznje.cetvrtak == true) {
      this.daniVoznje.push(4);
    }
    if (this.linijaPodaci.daniVoznje.petak == true) {
      this.daniVoznje.push(5);
    }
    if (this.linijaPodaci.daniVoznje.subota == true) {
      this.daniVoznje.push(6);
    }
    if (this.linijaPodaci.daniVoznje.nedjelja == true) {
      this.daniVoznje.push(0);
    }
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
            this.DodajDaneVoznje();
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
      let saljemo = {
        linija_id: this.linija_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje
      };

      this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/Add`, saljemo, MojConfig.http_opcije()).subscribe(x => {
        this.router.navigate(['/pretraga']);
        porukaSuccess("Kupovina uspješna!")
      });
    }
    else {porukaError("Molimo odaberite datum vožnje!");

    }
  }
}

