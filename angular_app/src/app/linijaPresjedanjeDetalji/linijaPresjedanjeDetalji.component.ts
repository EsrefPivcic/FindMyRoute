import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import {LoginInformacije} from "../_helpers/login-informacije";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";

@Component({
  selector: 'app-linijaPresjedanjeDetalji',
  templateUrl: './linijaPresjedanjeDetalji.component.html',
  styleUrls: ['./linijaPresjedanjeDetalji.component.css']
})
export class linijaPresjedanjeDetaljiComponent implements OnInit {

  title: string = 'FindMyRoute - Detalji presjedanja';
  id1 : number;
  id2 : number;
  cekanjePresjedanja : number;
  linijaPodaci1 : any;
  linijaPodaci2 : any;
  prevoznikLogo1: string;
  prevoznikLogo2: string;
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  loginInfo():LoginInformacije {
    return AutentifikacijaHelper.getLoginInfo();
  }

  btnKupovina(): void {
    this.router.navigate(['/kupovinaPresjedanje', this.linijaPodaci1.id, this.linijaPodaci2.id]);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id1 = +params['id1'];
    });
    this.route.params.subscribe(params => {
      this.id2 = +params['id2'];
    });
    this.route.params.subscribe(params => {
      this.cekanjePresjedanja = +params['cekanje'];
    });
    this.GetLinija1();
    this.GetLinija2();
  }
  GetLinija1(): void {
    fetch(MojConfig.adresa_servera+ "/Linija/Get/id?id="+this.id1)
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
            const uniqueParam = new Date().getTime();
            this.prevoznikLogo1 = `${MojConfig.adresa_servera}/Prevoznik/GetSlikaDB/${this.linijaPodaci1.prevoznik.id}?v=${uniqueParam}`;
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  GetLinija2(): void {
    fetch(MojConfig.adresa_servera+ "/Linija/Get/id?id="+this.id2)
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
            const uniqueParam = new Date().getTime();
            this.prevoznikLogo2 = `${MojConfig.adresa_servera}/Prevoznik/GetSlikaDB/${this.linijaPodaci2.prevoznik.id}?v=${uniqueParam}`;
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  Prevoznik(id: number): void {
    this.router.navigate(['/prevoznik', id]);
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
    <p>Na ovoj stranici su prikazani detalji linije sa presjedanjem. Ovdje možete pronaći sve potrebne informacije o linijama, prevoznicima i mogućnostima kupovine karata.</p>
    <p>Detalji linije:<br>
    Na ovoj stranici možete pronaći sve informacije o odabranim linijama, uključujući polazišnu i odredišnu destinaciju, vremena polaska i dolaska, trajanje putovanja i cijene karata. Također ćete pronaći i osnovne informacije o prevoznicima koji obavljaju ove linije.</p>
    <p>Detalji prevoznika:<br>
    Klikom na ime prevoznika na stranici sa detaljima linija, otvara se novi prozor koji pruža sve relevantne informacije o odabranom prevozniku.</p>
    <p>Kupovina karata:<br>
    Na stranici sa detaljima linija, pronaći ćete i dugme za kupovinu karata. Klikom na to dugme, bit ćete preusmjereni na platformu za online kupovinu karata za odabrane linije. Ovdje ćete moći jednostavno odabrati datum putovanja i izvršiti sigurnu i brzu kupovinu karata.</p>

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
