import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";
import {LoginInformacije} from "../_helpers/login-informacije";
import {stringify} from "@angular/compiler/src/util";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

const Broj = /^\d+$/;
const BrojRegex = new RegExp('Broj');
const Slova = /^[a-zA-Z\u010D\u0107\u017E\u0111\u0161]+$/u;
const SlovaRegex = new RegExp('Slova');

@Component({
  selector: 'app-upravljanjeLinije',
  templateUrl: './upravljanjeLinije.component.html',
  styleUrls: ['./upravljanjeLinije.component.css']
})

export class UpravljanjeLinijeComponent implements OnInit {
  txtGrad1: any;
  txtGrad2: any;
  txtPolazakSati: any;
  txtPolazakMinute: any;
  txtDolazakSati: any;
  txtDolazakMinute: any;
  chkPonedjeljak: boolean;
  chkUtorak: boolean;
  chkSrijeda: boolean;
  chkCetvrtak: boolean;
  chkPetak: boolean;
  chkSubota: boolean;
  chkNedjelja: boolean;
  txtKilometraza: any;
  txtCijena: any;
  linijePodaci: any;

  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.UcitajLinije();
    console.log(this.linijePodaci);
  }

  parseInt(value: any): number {
    return parseInt(value, 10);
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

    UcitajLinije(): void {
    fetch(MojConfig.adresa_servera+ "/Linija/GetByRadnik/radnikId?radnikId="+this.loginInfo().autentifikacijaToken.korisnickiNalog.id)
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
            this.linijePodaci = x;
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
    if (this.txtGrad1 == null || this.txtGrad2 == null || this.txtPolazakSati == null || this.txtPolazakMinute == null ||
      this.txtDolazakSati == null || this.txtDolazakMinute == null || this.txtCijena == null || this.txtKilometraza == null) {
      porukaError("Sva polja su obavezna!");
      return false;
    }
    if (!this.txtGrad1.match(Slova) || !this.txtGrad2.match(Slova)) {
      porukaError("Za unos imena gradova dozvoljena su samo slova od A do Ž!");
      return false;
    }
    if (!this.txtKilometraza.match(Broj) || !this.txtCijena.match(Broj)) {
      porukaError("Za unos kilometraže i cijene dozvoljeni su samo brojevi!");
      return false;
    }
    return true;
  }

  btnDodajLiniju() {
    if (this.Validiraj()) {
      let saljemo = {
        grad1: this.txtGrad1,
        grad2: this.txtGrad2,
        prevoznik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        polazakSati: this.txtPolazakSati,
        polazakMinute: this.txtPolazakMinute,
        dolazakSati: this.txtDolazakSati,
        dolazakMinute: this.txtDolazakMinute,
        ponedjeljakVoznja: this.chkPonedjeljak,
        utorakVoznja: this.chkUtorak,
        srijedaVoznja: this.chkSrijeda,
        cetvrtakVoznja: this.chkCetvrtak,
        petakVoznja: this.chkPetak,
        subotaVoznja: this.chkSubota,
        nedjeljaVoznja: this.chkNedjelja,
        kilometraza: this.txtKilometraza,
        cijena: this.txtCijena,
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Linija/AddByRadnik`, saljemo, MojConfig.http_opcije()).subscribe(x => {
        this.txtGrad1 = null;
        this.txtGrad2 = null;
        this.txtPolazakSati = null;
        this.txtPolazakMinute = null;
        this.txtDolazakSati = null;
        this.txtDolazakMinute = null;
        this.chkPonedjeljak = false;
        this.chkUtorak = false;
        this.chkSrijeda = false;
        this.chkCetvrtak = false;
        this.chkPetak = false;
        this.chkSubota = false;
        this.chkNedjelja = false;
        this.txtKilometraza = null;
        this.txtCijena = null;
        this.ngOnInit();
        porukaSuccess("Linija je uspješno dodana!")
      });
    }
  }

  Detalji(linija : any) {
    if (linija.presjedanje == "Direktna linija") {
      this.router.navigate(['/detalji', linija.id]);
    }
    else {
      this.router.navigate(['/detaljiPresjedanje', linija.id1, linija.id2]);
    }
  }

  UkloniLiniju(linija: any) {
    this.httpKlijent.delete(`${MojConfig.adresa_servera}/Linija/Delete/${linija.id}`, MojConfig.http_opcije()).subscribe(x=>{
      this.ngOnInit();
    });
  }

}
