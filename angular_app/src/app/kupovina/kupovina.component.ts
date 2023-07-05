import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {LoginInformacije} from "../_helpers/login-informacije";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

const Broj = /^\d+$/;
const Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

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
  txtNacinPlacanja: string = "";
  kreditnaPodaci: any;
  txtTip: string = "";
  txtBroj1: string = "";
  txtBroj2: string = "";
  txtBroj3: string = "";
  txtBroj4: string = "";
  txtDatum1: string = "";
  txtDatum2: string = "";
  txtSigBroj: string = "";
  txtSigBrojPotvrdi: string = "";
  txtPayPalMail: string = "";
  prevoznikLogo: string = "";
  presjedanje: boolean = false;
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
    this.GetLinija();
    if (this.loginInfo().autentifikacijaToken.korisnickiNalog.posjedujeKreditnu) {
      this.GetKreditna();
    }
  }

  GetKreditna(): void {
    fetch(MojConfig.adresa_servera+ "/KreditnaKartica/GetByKorisnik/korisnikId?korisnikId="+this.loginInfo().autentifikacijaToken.korisnickiNalog.id )
      .then(
        r=> {
          if (r.status != 200) {
            if (r.status == 400) {
              alert("Nepoznat korisnik!");
            }
            else {
              alert("greska" + r.status);
            }
            return;
          }
          r.json().then(x=>{
            this.kreditnaPodaci = x;
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  GetLinija(): void{
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
            const uniqueParam = new Date().getTime(); // Generate a unique timestamp
            this.prevoznikLogo = `${MojConfig.adresa_servera}/Prevoznik/GetSlikaDB/${this.linijaPodaci.prevoznik.id}?v=${uniqueParam}`;
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
      porukaError("Molimo odaberite datum vožnje!");
      return false;
    }
    if (this.txtSigBrojPotvrdi == "") {
      porukaError("Molimo unesite sigurnosni broj vaše povezane kreditne kartice!");
      return false;
    }
    return true;
  }

  ValidirajNovaKartica(): boolean {
    if (this.txtTip == "" || this.txtBroj1 == "" || this.txtBroj2 == "" || this.txtBroj3 == "" || this.txtBroj4 == ""
      || this.txtDatum1 == "" || this.txtDatum2 == "" || this.txtSigBroj == "") {
      porukaError("Sva polja su obavezna!");
      return false;
    }
    if (!this.txtBroj1.match(Broj) || !this.txtBroj2.match(Broj) || !this.txtBroj3.match(Broj) || !this.txtBroj4.match(Broj)
      || !this.txtDatum1.match(Broj) || !this.txtDatum2.match(Broj) || !this.txtSigBroj.match(Broj)) {
      porukaError("Molimo unesite podatke u brojevnom obliku!");
      return false;
    }
    if (this.datumVoznje == '') {
      porukaError("Molimo odaberite datum vožnje!");
      return false;
    }
    return true;
  }

  ValidirajPayPal(): boolean {
    if (this.txtPayPalMail == "")
    {
      porukaError("Molimo unesite email adresu!");
    }
    if (!this.txtPayPalMail.match(Email)) {
      porukaError("Molimo unesite ispravnu email adresu!");
      return false;
    }
    if (this.datumVoznje == '') {
      porukaError("Molimo odaberite datum vožnje!");
      return false;
    }
    return true;
  }

  btnPlatiPayPal(): void {
    if (this.ValidirajPayPal()) {
      let kupovina = {
        linija_id: this.linija_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
        payPalEmail: this.txtPayPalMail,
        presjedanje: this.presjedanje
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/PlatiPayPal`, kupovina, MojConfig.http_opcije()).subscribe(x => {
        this.router.navigate(['/pretraga']);
        porukaSuccess("Kupovina uspješna!")
      });
    }
  }

  LogOut(): void {
    AutentifikacijaHelper.setLoginInfo(null);
    this.httpKlijent.post(MojConfig.adresa_servera + "/Autentifikacija/Logout/", null, MojConfig.http_opcije())
      .subscribe((x: any) => {
        this.router.navigateByUrl("/pretraga");
        porukaSuccess("Kreditna kartica uspješno dodana, potrebno se ponovo ulogirati!");
      });
  }

  btnPlatiNovom(spremiKarticu: boolean): void{
    if (this.ValidirajNovaKartica()) {
      let kupovina = {
        linija_id: this.linija_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
        tipKartice: this.txtTip,
        brojKartice: this.txtBroj1 +"-"+ this.txtBroj2 +"-"+ this.txtBroj3 +"-"+ this.txtBroj4,
        datumIsteka: this.txtDatum1 +"/"+ this.txtDatum2,
        sigurnosniBroj: this.txtSigBroj,
        poveziKarticu: spremiKarticu,
        presjedanje: this.presjedanje
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/PlatiNovomKarticom`, kupovina, MojConfig.http_opcije()).subscribe(x => {
        if (spremiKarticu) {
          porukaSuccess("Kupovina uspješna!");
          this.LogOut();
        }
        else {
          this.router.navigate(['/pretraga']);
          porukaSuccess("Kupovina uspješna!");
        }
      });
    }
  }

  Prevoznik(): void {
    this.router.navigate(['/prevoznik', this.linijaPodaci.prevoznik.id]);
  }

  btnPlatiPovezanom(): void {
    if (this.Validiraj()) {
      let kupovina = {
        linija_id: this.linija_id,
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        kreditna_id: this.kreditnaPodaci.id,
        kolicina: this.txtKolicina,
        datumVoznje: this.datumVoznje,
        sigurnosniBroj: this.txtSigBrojPotvrdi,
        presjedanje: this.presjedanje
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/Kupovina/Plati`, kupovina, MojConfig.http_opcije()).subscribe(x => {
        this.router.navigate(['/pretraga']);
        porukaSuccess("Kupovina uspješna!")
      });
    }
  }
}

