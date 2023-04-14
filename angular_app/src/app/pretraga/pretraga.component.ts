import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-pretraga',
  templateUrl: 'pretraga.component.html',
  styleUrls: ['pretraga.component.css']
})
export class PretragaComponent implements OnInit {

  title:string = 'FindMyRoute';
  linijePodaci: any;
  grad1 : string;
  grad2 : string;
  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
  }

  GetLinijaByID(linija : any) {
    if (linija.presjedanje == "Direktna linija") {
      this.router.navigate(['/detalji', linija.id]);
    }
    else {
      this.router.navigate(['/detaljiPresjedanje', linija.id1, linija.id2]);
    }
  }

  pretraga() {
    this.grad1 = (document.getElementById('polaziste') as HTMLInputElement).value;
    this.grad2 = (document.getElementById('destinacija') as HTMLInputElement).value;
    console.log(this.grad1);
    console.log(this.grad2);
    fetch(MojConfig.adresa_servera+ "/Linija/GetByGradovi/gradovi?grad1="+this.grad1+"&grad2="+this.grad2)
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
            if (this.linijePodaci.length != 0) {
              document.getElementById("tabela").style.opacity="1";
              document.getElementById("nemaRez").style.opacity="0";
            }
            else {
              document.getElementById("nemaRez").style.opacity="1";
              document.getElementById("tabela").style.opacity="0";
            }
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
