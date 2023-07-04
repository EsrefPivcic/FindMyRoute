import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from "@angular/forms"
import { AppComponent } from './app.component';
import { HttpClientModule} from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { HomeComponent } from './home/home.component';
import {AutorizacijaLoginProvjera} from "./_guards/autorizacija-login-provjera.service";
import { NotFoundComponent } from './not-found/not-found.component';
import { ChartsModule } from 'ng2-charts';
import { PostavkeProfilaComponent } from './postavke-profila/postavke-profila.component';
import {linijaDetaljiComponent} from "./linijaDetalji/linijaDetalji.component";
import {linijaPresjedanjeDetaljiComponent} from "./linijaPresjedanjeDetalji/linijaPresjedanjeDetalji.component";
import {PretragaComponent} from "./pretraga/pretraga.component";
import {UpravljanjeComponent} from "./upravljanje/upravljanje.component";
import {UpravljanjeLinijeComponent} from "./upravljanjeLinije/upravljanjeLinije.component";
import {KupovinaComponent} from "./kupovina/kupovina.component";
import {ONamaComponent} from "./oNama/oNama.component";
import {KontaktComponent} from "./kontakt/kontakt.component";
import {KupovinaPresjedanjeComponent} from "./kupovinaPresjedanje/kupovinaPresjedanje.component";
import {KorisnickiRacunComponent} from "./korisnickiRacun/korisnickiRacun.component";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {UpravljanjeKreditnaComponent} from "./upravljanjeKreditna/upravljanjeKreditna.component";
import {HistorijaKupovineComponent} from "./historijaKupovine/historijaKupovine.component";
import {DetaljiKupovineComponent} from "./detaljiKupovine/detaljiKupovine.component";
import {UpravljanjePrevoznikComponent} from "./upravljanjePrevoznik/upravljanjePrevoznik.component";
import {PrevoznikComponent} from "./prevoznik/prevoznik.component";
import {PrevozniciComponent} from "./prevoznici/prevoznici.component";

@NgModule({
  declarations: [
    AppComponent,
    linijaDetaljiComponent,
    linijaPresjedanjeDetaljiComponent,
    PretragaComponent,
    LoginComponent,
    RegistracijaComponent,
    HomeComponent,
    NotFoundComponent,
    PostavkeProfilaComponent,
    UpravljanjeComponent,
    UpravljanjeLinijeComponent,
    KupovinaComponent,
    KupovinaPresjedanjeComponent,
    ONamaComponent,
    KontaktComponent,
    KorisnickiRacunComponent,
    UpravljanjeKreditnaComponent,
    HistorijaKupovineComponent,
    DetaljiKupovineComponent,
    UpravljanjePrevoznikComponent,
    PrevoznikComponent,
    PrevozniciComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'pretraga', component: PretragaComponent},
      {path: 'detalji/:id', component: linijaDetaljiComponent},
      {path: 'detaljiPresjedanje/:id1/:id2/:cekanje', component: linijaPresjedanjeDetaljiComponent},
      {path: 'login', component: LoginComponent},
      {path: 'registracija', component: RegistracijaComponent},
      {path: 'home', component: HomeComponent, canActivate: [AutorizacijaLoginProvjera]},
      {path: 'postavke-profila', component: PostavkeProfilaComponent, canActivate: [AutorizacijaLoginProvjera]},
      {path: 'upravljanje', component: UpravljanjeComponent, canActivate:[AutorizacijaLoginProvjera]},
      {path: 'upravljanjeLinije', component: UpravljanjeLinijeComponent, canActivate:[AutorizacijaLoginProvjera]},
      {path: 'kupovina/:id', component: KupovinaComponent, canActivate:[AutorizacijaLoginProvjera]},
      {path: 'kupovinaPresjedanje/:id1/:id2', component: KupovinaPresjedanjeComponent, canActivate:[AutorizacijaLoginProvjera]},
      {path: 'oNama', component: ONamaComponent},
      {path: 'kontakt', component: KontaktComponent},
      {path: 'korisnickiRacun', component: KorisnickiRacunComponent, canActivate:[AutorizacijaLoginProvjera]},
      {path: 'upravljanjeKreditna/:id', component: UpravljanjeKreditnaComponent, canActivate:[AutorizacijaLoginProvjera]},
      {path: 'historijaKupovine', component: HistorijaKupovineComponent, canActivate:[AutorizacijaLoginProvjera]},
      {path: 'detaljiKupovine/:id', component: DetaljiKupovineComponent, canActivate:[AutorizacijaLoginProvjera]},
      {path: 'upravljanjePrevoznik', component: UpravljanjePrevoznikComponent, canActivate:[AutorizacijaLoginProvjera]},
      {path: 'prevoznik/:id', component: PrevoznikComponent},
      {path: 'prevoznici', component: PrevozniciComponent},
      {path: '**', component: NotFoundComponent},
    ]),
    FormsModule,
    HttpClientModule,
    ChartsModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [
    AutorizacijaLoginProvjera,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
