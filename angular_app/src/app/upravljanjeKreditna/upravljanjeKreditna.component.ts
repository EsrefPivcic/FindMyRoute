import { Component, OnInit } from '@angular/core';
import {MojConfig} from "../moj-config";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";
import {LoginInformacije} from "../_helpers/login-informacije";
import {escapeRegExp} from "@angular/compiler/src/util";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

const Broj = /^\d+$/;

@Component({
  selector: 'app-upravljanjeKreditna',
  templateUrl: './upravljanjeKreditna.component.html',
  styleUrls: ['./upravljanjeKreditna.component.css']
})
export class UpravljanjeKreditnaComponent implements OnInit {
  txtTip: string = "";
  txtTipEdit: string = "";
  txtBroj1: string = "";
  txtBroj1Edit: string = "";
  txtBroj2: string = "";
  txtBroj2Edit: string = "";
  txtBroj3: string = "";
  txtBroj3Edit: string = "";
  txtBroj4: string = "";
  txtBroj4Edit: string = "";
  txtDatum1: string = "";
  txtDatum1Edit: string = "";
  txtDatum2: string = "";
  txtDatum2Edit: string = "";
  txtSigBroj: string = "";
  txtSigBrojEdit: string = "";
  txtSigBrojTrenutni: string = "";
  id: any;
  kreditnaPodaci: any;

  constructor(private httpKlijent: HttpClient, private router: Router,  private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    if (this.id != 0) {
      fetch(MojConfig.adresa_servera+ "/KreditnaKartica/Get/id?id="+this.id)
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
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  Validiraj(): boolean {
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
    return true;
  }

  LogOut(): void {
    AutentifikacijaHelper.setLoginInfo(null);
    this.httpKlijent.post(MojConfig.adresa_servera + "/Autentifikacija/Logout/", null, MojConfig.http_opcije())
      .subscribe((x: any) => {
        this.router.navigateByUrl("/pretraga");
        porukaSuccess("Kreditna kartica uspješno dodana, potrebno se ponovo ulogirati!");
      });
  }

  btnPovezi() {
    if (this.Validiraj()) {
      let kartica = {
        korisnik_id: this.loginInfo().autentifikacijaToken.korisnickiNalog.id,
        tipKartice: this.txtTip,
        brojKartice: this.txtBroj1 +"-"+ this.txtBroj2 +"-"+ this.txtBroj3 +"-"+ this.txtBroj4,
        datumIsteka: this.txtDatum1 +"/"+ this.txtDatum2,
        sigurnosniBroj: this.txtSigBroj
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/KreditnaKartica/Add`, kartica, MojConfig.http_opcije()).subscribe(x=>{
        this.LogOut();
      });
    }
  }

  ValidirajEdit(): boolean {
    if (this.txtTipEdit == "" && (this.txtBroj1Edit == "" || this.txtBroj2Edit == "" || this.txtBroj3Edit == "" || this.txtBroj4Edit == "")
      && this.txtDatum1Edit == "" && this.txtDatum2Edit == "" && this.txtSigBrojEdit == "") {
      porukaError("Popunite bar jedno polje!");
      return false;
    }
    if ((this.txtBroj1Edit != "" && (this.txtBroj2Edit == "" || this.txtBroj3Edit == "" || this.txtBroj4Edit == ""))
    || (this.txtBroj2Edit != "" && (this.txtBroj1Edit == "" || this.txtBroj3Edit == "" || this.txtBroj4Edit == ""))
      || (this.txtBroj3Edit != "" && (this.txtBroj1Edit == "" || this.txtBroj2Edit == "" || this.txtBroj4Edit == ""))
      || (this.txtBroj4Edit != "" && (this.txtBroj1Edit == "" || this.txtBroj3Edit == "" || this.txtBroj2Edit == ""))) {
      porukaError("Novi broj kartice unesite u cijelosti!");
      return false;
    }
    if ((this.txtDatum1Edit != "" && this.txtDatum2Edit == "") || (this.txtDatum2Edit != "" && this.txtDatum1Edit == "")) {
      porukaError("Novi datum unesite u cijelosti!");
      return false;
    }
    if ((!this.txtBroj1Edit.match(Broj) && this.txtBroj1Edit != "") || (!this.txtBroj2Edit.match(Broj) && this.txtBroj2Edit != "") ||
      (!this.txtBroj3Edit.match(Broj) && this.txtBroj3Edit != "") || (!this.txtBroj4Edit.match(Broj) && this.txtBroj4Edit != "")
      || (!this.txtDatum1Edit.match(Broj) && this.txtDatum1Edit != "") || (!this.txtDatum2Edit.match(Broj) && this.txtDatum2Edit != "")
      || (!this.txtSigBrojTrenutni.match(Broj) && this.txtSigBrojTrenutni != "") || (!this.txtSigBrojEdit.match(Broj) && this.txtSigBrojEdit != ""))
    {
      porukaError("Molimo unesite podatke u brojevnom obliku!");
      return false;
    }
    if (this.txtSigBrojTrenutni == "") {
      porukaError("Molimo potvrdite trenutni sigurnosni broj!");
      return false;
    }
    return true;
  }

  btnEdit() {
    if (this.ValidirajEdit()) {
      let karticaEdit = {
        id: this.kreditnaPodaci.id,
        tipKartice: this.txtTipEdit,
        brojKartice: this.txtBroj1Edit == "" ? "" : this.txtBroj1Edit +"-"+ this.txtBroj2Edit +"-"+ this.txtBroj3Edit +"-"+ this.txtBroj4Edit,
        datumIsteka: this.txtDatum1Edit == "" ? "" : this.txtDatum1Edit +"/"+ this.txtDatum2Edit,
        sigurnosniBroj: this.txtSigBrojEdit == "" ? "" : this.txtSigBrojEdit,
        trenutniSigBroj: this.txtSigBrojTrenutni
      };
      this.httpKlijent.post(`${MojConfig.adresa_servera}/KreditnaKartica/Edit`, karticaEdit, MojConfig.http_opcije()).subscribe(x=>{
        this.router.navigateByUrl("/korisnickiRacun");
        porukaSuccess("Kartica uspješno ažurirana!")
      });
    }
  }

}
