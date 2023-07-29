import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {LoginInformacije} from "../_helpers/login-informacije";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";

@Component({
  selector: 'app-linijaDetalji',
  templateUrl: './linijaDetalji.component.html',
  styleUrls: ['./linijaDetalji.component.css']
})
export class linijaDetaljiComponent implements OnInit {
  id : number;
  linijaPodaci : any;
  prevoznikLogo: string;
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  btnKupovina(): void {
    this.router.navigate(['/kupovina', this.linijaPodaci.id]);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.GetLinija();
  }

  Prevoznik(): void {
    this.router.navigate(['/prevoznik', this.linijaPodaci.prevoznik.id]);
  }

  GetLinija(): void {
    fetch(MojConfig.adresa_servera+ "/Linija/Get/id?id="+this.id)
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
            const uniqueParam = new Date().getTime();
            this.prevoznikLogo = `${MojConfig.adresa_servera}/Prevoznik/GetSlikaDB/${this.linijaPodaci.prevoznik.id}?v=${uniqueParam}`;
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  PrikaziHelp(): void {
    const form = document.createElement("form");

    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.backgroundColor = "#f8f9fa";
    form.style.padding = "20px";
    form.style.borderRadius = "8px";
    form.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.2)";

    form.innerHTML = `
    <h3 style="margin-bottom: 10px; text-align: center;">Pomoć</h3>
    <div style="display: flex; flex-direction: column; gap: 10px;">
    <p>Na ovoj stranici možete pronaći sve potrebne informacije o linijama, prevoznicima i mogućnostima kupovine karata.</p>
    <p>Detalji linije:<br>
    Na ovoj stranici možete pronaći sve informacije o odabranoj liniji, uključujući polazišnu i odredišnu destinaciju, vremena polaska i dolaska, trajanje putovanja i cijene karata. Također ćete pronaći i osnovne informacije o prevozniku koji obavlja ovu liniju.</p>
    <p>Detalji prevoznika:<br>
    Klikom na ime prevoznika na stranici sa detaljima linije, otvara se novi prozor koji pruža sve relevantne informacije o odabranom prevozniku.</p>
    <p>Kupovina karata:<br>
    Na stranici sa detaljima linije, pronaći ćete i dugme za kupovinu karata. Klikom na to dugme, bit ćete preusmjereni na platformu za online kupovinu karata za odabranu liniju. Ovdje ćete moći jednostavno odabrati datum putovanja i izvršiti sigurnu i brzu kupovinu karata.</p>

    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
        <button id="closeBtn" style="margin-top: 10px; padding: 10px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Zatvori</button>
    </div>
  `;

    document.body.appendChild(form);

    const closeButton = document.getElementById("closeBtn");
    if (closeButton) {
      closeButton.addEventListener("click", (event) => {
        event.preventDefault();
        form.remove();
      });
    }
  }

}
