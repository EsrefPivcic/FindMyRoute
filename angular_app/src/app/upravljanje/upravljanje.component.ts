import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";

@Component({
  selector: 'app-upravljanje',
  templateUrl: './upravljanje.component.html',
  styleUrls: ['./upravljanje.component.css']
})

export class UpravljanjeComponent implements OnInit {
  constructor(private httpKlijent: HttpClient, private router: Router) {}

  ngOnInit(): void {

  }
}
