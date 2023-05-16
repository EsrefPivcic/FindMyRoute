import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";

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
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    //preuzima ID linije iz URL query parametra
    this.route.params.subscribe(params => {
      this.id1 = +params['id1']; // (+) converts string 'id' to a number
    });
    this.route.params.subscribe(params => {
      this.id2 = +params['id2']; // (+) converts string 'id' to a number
    });
    this.route.params.subscribe(params => {
      this.cekanjePresjedanja = +params['cekanje']; // (+) converts string 'id' to a number
    });
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
          });
        }
      )
      .catch(
        err=>{
          alert("greska" + err);
        }
      )
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

