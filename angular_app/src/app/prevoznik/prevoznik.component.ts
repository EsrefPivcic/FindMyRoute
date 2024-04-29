import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-prevoznik',
  templateUrl: './prevoznik.component.html',
  styleUrls: ['./prevoznik.component.css']
})

export class PrevoznikComponent implements OnInit {
  linijePodaci: any;
  prevoznikPodaci: any;
  Logo: string;
  id: number;

  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.UcitajPrevoznika();
    this.UcitajLinije();
    console.log(this.linijePodaci);
  }

  UcitajLogo(id: number): void {
    const uniqueParam = new Date().getTime();
    this.Logo = `${MojConfig.adresa_servera}/Prevoznik/GetSlikaDB/${id}?v=${uniqueParam}`;
  }

  UcitajPrevoznika():void {
    fetch(MojConfig.adresa_servera+ "/Prevoznik/Get/id?id="+this.id)
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
            this.UcitajLogo(x.id);
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
  }

  UcitajLinije(): void {
    fetch(MojConfig.adresa_servera+ "/Linija/GetByPrevoznik/prevoznikId?prevoznikId="+this.id)
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

  Detalji(linija : any) {
    if (linija.presjedanje == "Direktna linija") {
      this.router.navigate(['/detalji', linija.id]);
    }
    else {
      this.router.navigate(['/detaljiPresjedanje', linija.id1, linija.id2]);
    }
  }

  PrikaziHelp(): void {
    const form = document.createElement("form");

    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.backgroundColor = "#3a3a5c";
    form.style.color = "white";
    form.style.padding = "20px";
    form.style.borderRadius = "8px";
    form.style.boxShadow = "0px 2px 10px rgba(0, 0, 0, 0.2)";

    form.innerHTML = `
    <h3 style="margin-bottom: 10px; text-align: center;">Pomoć</h3>
    <div style="display: flex; flex-direction: column; gap: 10px;">
    <p>Na ovoj stranici možete pronaći sve potrebne informacije o našem prevozniku, uključujući kontakte i cjelovit popis linija koje nudi.</p>
    <p>Naš prevoznik nudi pouzdan i udoban prijevoz do različitih odredišta. Kako biste saznali više o pojedinoj liniji, jednostavno kliknite na dugme "Detalji" pored njenog naziva.</p>
    <p>Klikom na "Detalji", otvorit će Vam se novi prozor koji sadrži sve relevantne informacije o toj liniji. Naći ćete polazište i odredište, vrijeme polaska i dolaska, red vožnje, kao i dodatne informacije o uslugama koje možemo pružiti tijekom putovanja.</p>

    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
        <button id="closeBtn" style="margin-top: 10px; padding: 10px; background-color: #5a5a8d; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Zatvori</button>
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
