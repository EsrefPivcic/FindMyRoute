import { Component, OnInit } from '@angular/core';
import {MojConfig} from "../moj-config";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";
import {LoginInformacije} from "../_helpers/login-informacije";
import {AppComponent} from "../app.component";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  txtLozinka: any;
  txtKorisnickoIme: any;
  appComponent: AppComponent;
  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  btnLogin() {
    let saljemo = {
      korisnickoIme:this.txtKorisnickoIme,
      lozinka: this.txtLozinka
    };
    this.httpKlijent.post<LoginInformacije>(MojConfig.adresa_servera+ "/Autentifikacija/Login/", saljemo)
      .subscribe((x:LoginInformacije) =>{
        if (x.isLogiran) {
          AutentifikacijaHelper.setLoginInfo(x)
          this.router.navigateByUrl("/pretraga");
        }
        else
        {
          AutentifikacijaHelper.setLoginInfo(null)
          porukaError("Neispravan login!");
        }
      });
  }

}
