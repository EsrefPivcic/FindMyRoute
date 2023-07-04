import {Component, OnInit} from '@angular/core';
import {MojConfig} from "./moj-config";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AutentifikacijaHelper} from "./_helpers/autentifikacija-helper";
import {LoginInformacije} from "./_helpers/login-informacije";

declare function porukaSuccess(a: string):any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  Logo: string;
  ProfilnaSlika: string;
  prevoznikPodaci: any;
  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.UcitajLogo();
    if (this.loginInfo().isLogiran) {
      this.UcitajProfilnu(this.loginInfo().autentifikacijaToken.korisnickiNalog.id);
    }
    else {
      this.ProfilnaSlika = "";
    }
    this.router.navigate(['/pretraga']);
  }

  RefreshProfilnu(): boolean {
      this.UcitajProfilnu(this.loginInfo().autentifikacijaToken.korisnickiNalog.id);
      return true;
  }

  UcitajLogo(): void {
    this.Logo = `${MojConfig.adresa_servera}/LogoAplikacije/Get`;
  }

  public UcitajProfilnu(id: number): void {
    const uniqueParam = new Date().getTime();
    if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isKorisnik) {
      this.ProfilnaSlika = `${MojConfig.adresa_servera}/Korisnik/GetSlikaDB/${id}?v=${uniqueParam}`;
    }
    if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isRadnikFirme) {
      this.ProfilnaSlika = `${MojConfig.adresa_servera}/RadnikFirme/GetSlikaDB/${id}?v=${uniqueParam}`;
    }
    if (this.loginInfo().autentifikacijaToken.korisnickiNalog.isAdministrator) {
      this.ProfilnaSlika = `${MojConfig.adresa_servera}/Administrator/GetSlikaDB/${id}?v=${uniqueParam}`;
    }
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  logoutButton() {
    let token = MojConfig.http_opcije();
    AutentifikacijaHelper.setLoginInfo(null);
    this.httpKlijent.post(MojConfig.adresa_servera + "/Autentifikacija/Logout/", null, token)
      .subscribe((x: any) => {
        porukaSuccess("Logout uspješan");
      });
    this.router.navigateByUrl("/login");
  }
}
