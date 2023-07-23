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

  PrikaziHelp(): void {
    // Create a form element dynamically
    const form = document.createElement("form");

    // Add form styling, attributes, and content
    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.backgroundColor = "#f8f9fa";
    form.style.padding = "20px";
    form.style.borderRadius = "8px";
    form.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.2)";

    // Add form content
    form.innerHTML = `
    <h3 style="margin-bottom: 10px; text-align: center;">Pomoć</h3>
    <div style="display: flex; flex-direction: column; gap: 10px;">
<p>Molimo unesite Vaše korisničko ime i lozinku kako biste pristupili svom korisničkom računu.</p>
<p>Kada ste unijeli svoje korisničko ime i lozinku, provjerite jesu li podaci tačni, a zatim kliknite na "Prijavi se" dugme kako biste pristupili svom korisničkom računu.</p>
<p>Ako ste novi korisnik, kliknite na "Registrirajte se" dugme ispod kako biste kreirali svoj korisnički račun. Time ćete otvoriti novi prozor koji će Vas voditi kroz jednostavan postupak registracije.</p>
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
        <button id="closeBtn" style="margin-top: 10px; padding: 10px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Zatvori</button>
    </div>
  `;

    // Append the form to the body element
    document.body.appendChild(form);

    // Add click event listener to the "Zatvori" button
    const closeButton = document.getElementById("closeBtn");
    if (closeButton) {
      closeButton.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent form submission
        form.remove(); // Remove the form from the DOM
      });
    }
  }

}
