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
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    this.UcitajPrevoznika();
    this.UcitajLinije();
    console.log(this.linijePodaci);
  }

  UcitajLogo(id: number): void {
    const uniqueParam = new Date().getTime(); // Generate a unique timestamp
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
}
