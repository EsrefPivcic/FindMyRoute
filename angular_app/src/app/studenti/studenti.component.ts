import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

@Component({
  selector: 'app-korisnici',
  templateUrl: './studenti.component.html',
  styleUrls: ['./studenti.component.css']
})
export class StudentiComponent implements OnInit {

  title:string = 'FindMyRoute';
  ime_prezime:string = '';
  opstina: string = '';
  studentPodaci: any;
  filter_ime_prezime: boolean;
  filter_opstina: boolean;


  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
  }

  pretraga(grad1 : string, grad2 : string) {
    fetch(MojConfig.adresa_servera+ "/Linija/GetByGradovi/gradovi?grad1="+grad1+"&grad2="+grad2)
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
            this.studentPodaci = x;
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
