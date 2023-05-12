import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

const BrojTelefona = /[0-9]{8}/;
const BrojTelefonaRegex = new RegExp('BrojTelefona');
const Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const EmailRegex = new RegExp('Email');

@Component({
  selector: 'app-upravljanje',
  templateUrl: './upravljanje.component.html',
  styleUrls: ['./upravljanje.component.css']
})

export class UpravljanjeComponent implements OnInit {
  txtNaziv: any;
  txtAdresa: any;
  txtEmail: any;
  txtBrojTelefona: any;
  prevoznikPodaci: any;

  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.UcitajPrevoznike();
  }

  UcitajPrevoznike(): void {
    fetch(MojConfig.adresa_servera+ "/Prevoznik/GetAll")
      .then(
        r=> {
          if (r.status != 200) {
            if (r.status == 400) {
              alert("Molimo unesite nazive oba grada!");
            }
            else {
              alert("greska" + r.status);
            }
            return;
          }
          r.json().then(x=>{
            this.prevoznikPodaci = x;
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
    if (this.txtNaziv == null || this.txtAdresa == null || this.txtEmail == null || this.txtBrojTelefona == null) {
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

  btnDodajPrevoznika() {
    if (this.Validiraj()) {
      let saljemo = {
        naziv: this.txtNaziv,
        adresa: this.txtAdresa,
        email: this.txtEmail,
        brojTelefona: "+387" + this.txtBrojTelefona
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Prevoznik/Add`, saljemo, MojConfig.http_opcije()).subscribe(x => {
        this.txtNaziv = null;
        this.txtAdresa = null;
        this.txtEmail = null;
        this.txtBrojTelefona = null;
        this.ngOnInit();
        porukaSuccess("Prevoznik je uspješno dodan!")
      });
    }
  }

  UkloniPrevoznika(prevoznik: any) {
    this.httpKlijent.delete(`${MojConfig.adresa_servera}/Prevoznik/Delete/${prevoznik.id}`, MojConfig.http_opcije()).subscribe(x=>{
      this.ngOnInit();
    });
  }
}
