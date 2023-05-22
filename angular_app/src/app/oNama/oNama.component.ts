import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-oNama',
  templateUrl: 'oNama.component.html',
  styleUrls: ['oNama.component.css']
})
export class ONamaComponent implements OnInit {

  title:string = 'FindMyRoute';
  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
  }
}
